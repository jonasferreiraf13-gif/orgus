# Hospedagem do site Orgus no GitHub e na Cloudflare

Este projeto deve ser publicado como **Cloudflare Worker**, e não como Cloudflare Pages. Ele usa:

- D1 para produtos, permissões, documentos e mensagens;
- R2 para imagens de produtos, catálogos e relatórios em PDF;
- autenticação própria por e-mail e senha para proteger o painel administrativo.

## 1. Pré-requisitos

- Conta no GitHub;
- Conta na Cloudflare;
- Node.js 22 ou superior e pnpm 11 para a configuração inicial;
- Acesso às configurações do Worker para cadastrar a senha administrativa como segredo.

## 2. Enviar o código para o GitHub

Crie um repositório vazio no GitHub. Depois, dentro da pasta extraída deste ZIP, execute:

```bash
git init
git add .
git commit -m "Primeira versão do site Orgus"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/orgus-site.git
git push -u origin main
```

Não envie arquivos `.env`, senhas, tokens ou credenciais para o GitHub.

## 3. Criar o banco D1 e o bucket R2

Na pasta do projeto:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm exec wrangler login
pnpm exec wrangler d1 create orgus-db
pnpm exec wrangler r2 bucket create orgus-files
```

O comando do D1 exibirá um `database_id`. Guarde esse valor.

Defina as quatro variáveis abaixo no terminal. Em macOS ou Linux:

```bash
export CLOUDFLARE_WORKER_NAME=orgus-site
export CLOUDFLARE_D1_DATABASE_NAME=orgus-db
export CLOUDFLARE_D1_DATABASE_ID=COLE-AQUI-O-DATABASE-ID
export CLOUDFLARE_R2_BUCKET_NAME=orgus-files
export NEXT_PUBLIC_SITE_URL=https://orgus.com.br
```

No PowerShell:

```powershell
$env:CLOUDFLARE_WORKER_NAME="orgus-site"
$env:CLOUDFLARE_D1_DATABASE_NAME="orgus-db"
$env:CLOUDFLARE_D1_DATABASE_ID="COLE-AQUI-O-DATABASE-ID"
$env:CLOUDFLARE_R2_BUCKET_NAME="orgus-files"
$env:NEXT_PUBLIC_SITE_URL="https://orgus.com.br"
```

Gere a configuração de produção e crie as tabelas:

```bash
pnpm run build:cloudflare
pnpm run cloudflare:migrate
```

O comando de migração é necessário apenas na implantação inicial e quando existirem novas migrações em `drizzle/`.

## 4. Fazer a primeira publicação

Para publicar diretamente do computador:

```bash
pnpm run cloudflare:deploy
```

O Wrangler mostrará a URL `workers.dev` ao final.

## 5. Conectar o GitHub à Cloudflare

No painel da Cloudflare:

1. Abra **Workers & Pages** e escolha a opção de criar/importar um Worker a partir de um repositório Git.
2. Conecte o GitHub, selecione o repositório e a branch `main`.
3. Em **Settings > Build**, configure:
   - Build command: `pnpm install --frozen-lockfile && pnpm run build:cloudflare`
   - Deploy command: `pnpm run cloudflare:deploy`
   - Root directory: deixe vazio, salvo se o projeto estiver dentro de uma subpasta do repositório.
4. Cadastre estas variáveis de build:
   - `CLOUDFLARE_WORKER_NAME=orgus-site`
   - `CLOUDFLARE_D1_DATABASE_NAME=orgus-db`
   - `CLOUDFLARE_D1_DATABASE_ID=<id do D1>`
   - `CLOUDFLARE_R2_BUCKET_NAME=orgus-files`
   - `NEXT_PUBLIC_SITE_URL=https://orgus.com.br`
5. Salve e inicie o deploy.

Depois disso, cada `git push` na branch `main` inicia uma nova publicação automática.

## 6. Conectar o domínio

No Worker, abra **Settings > Domains & Routes** e adicione `orgus.com.br`. Essa é a URL canônica configurada no site. Adicione também `www.orgus.com.br` e crie um redirecionamento permanente de `www` para o domínio sem `www`, evitando páginas duplicadas no Google.

## 7. Proteger o painel administrativo

O painel usa o e-mail fixo `admin@orgus.com.br`. A senha nunca deve ser colocada no Git, em arquivos `.env` versionados ou no código-fonte.

No painel da Cloudflare:

1. Abra **Workers & Pages** e selecione o Worker `orgus-site`.
2. Vá a **Settings > Variables and Secrets**.
3. Clique em **Add**.
4. Nome: `ADMIN_PASSWORD`.
5. Tipo: **Secret**.
6. Valor: a senha administrativa escolhida.
7. Salve e publique a nova versão, caso o painel solicite.

Também é possível cadastrar pelo terminal, depois de executar `pnpm run build:cloudflare`:

```bash
pnpm exec wrangler secret put ADMIN_PASSWORD --config dist/server/wrangler.json
```

O comando solicitará o valor sem exibi-lo na tela. Depois acesse `/admin` e entre com `admin@orgus.com.br`. A sessão permanece válida por 12 horas e é encerrada automaticamente quando a senha é alterada.

Importante: `ADMIN_PASSWORD` é um segredo de execução do Worker. Não o cadastre somente nas variáveis de build do GitHub e não adicione a senha real ao arquivo `cloudflare.env.example`.

## 8. Atualizações futuras

Após alterar arquivos:

```bash
git add .
git commit -m "Descrição da alteração"
git push
```

A Cloudflare fará o novo build automaticamente. Se houver um novo arquivo SQL em `drizzle/`, aplique antes ou logo após a publicação:

```bash
pnpm run build:cloudflare
pnpm run cloudflare:migrate
```

## 9. Ativar a indexação no Google

O projeto já inclui títulos, descrições, URLs canônicas, dados estruturados de organização, `robots.txt`, `sitemap.xml` e redirecionamentos permanentes das antigas URLs em `/wp/`.

Depois que `https://orgus.com.br` estiver publicado e acessível ao público:

1. Abra o **Google Search Console** e adicione a propriedade de domínio `orgus.com.br`.
2. Faça a verificação pelo registro TXT solicitado no DNS da Cloudflare.
3. Em **Sitemaps**, envie `https://orgus.com.br/sitemap.xml`.
4. Use **Inspeção de URL** na página inicial e solicite a indexação.

Não proteja o site público inteiro com uma tela de autenticação, ou os robôs do Google não conseguirão acessar as páginas. O painel `/admin` e suas APIs já exigem a sessão administrativa própria.

## 10. Diagnóstico rápido

- Erro de banco: confirme que o binding D1 se chama `DB` e que o `database_id` está correto.
- Imagens ou PDFs não enviam: confirme que o binding R2 se chama `BUCKET` e aponta para `orgus-files`.
- Painel informa que a senha não está configurada: confirme se `ADMIN_PASSWORD` foi salvo como segredo de runtime no Worker correto.
- Login informa credenciais incorretas: use exatamente `admin@orgus.com.br` e confira se a senha digitada é idêntica ao segredo cadastrado.
- Uma página abre, mas os links não navegam: limpe o cache da publicação e confirme que o último commit foi implantado.

## Referências oficiais

- Workers Builds: https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
- Cloudflare D1: https://developers.cloudflare.com/d1/get-started/
- Migrações D1: https://developers.cloudflare.com/d1/reference/migrations/
- R2 em Workers: https://developers.cloudflare.com/r2/api/workers/workers-api-usage/
- Secrets no Wrangler: https://developers.cloudflare.com/workers/configuration/secrets/
