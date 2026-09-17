# Hospedagem do site Orgus no GitHub e na Cloudflare

Este projeto deve ser publicado como **Cloudflare Worker**, e não como Cloudflare Pages. Ele usa:

- D1 para produtos, permissões, documentos e mensagens;
- R2 para imagens de produtos, catálogos e relatórios em PDF;
- Cloudflare Access para proteger o painel administrativo fora do ambiente ChatGPT Sites.

## 1. Pré-requisitos

- Conta no GitHub;
- Conta na Cloudflare;
- Node.js 22 ou superior e pnpm 11 para a configuração inicial;
- Um domínio gerenciado pela Cloudflare para usar o painel administrativo com Cloudflare Access.

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

O site público deve continuar aberto. Proteja somente:

- `seudominio.com/admin*`
- `seudominio.com/api/admin*`

No painel **Zero Trust**:

1. Vá a **Access controls > Applications**.
2. Crie uma aplicação **Self-hosted and private**.
3. Adicione os dois caminhos acima como hostnames/caminhos protegidos. Se o painel pedir uma aplicação por caminho, crie duas com a mesma política.
4. Crie uma política **Allow** apenas para `contato@orgus.com.br`.
5. Escolha o provedor de identidade. Para um único administrador, o código por e-mail da Cloudflare é suficiente; Google ou Microsoft também funcionam.

Na primeira entrada em `/admin`, clique em **Ativar meu acesso**. A partir daí esse usuário poderá cadastrar e editar produtos, subir/remover PDFs e consultar mensagens.

Importante: não deixe `/api/admin*` fora da proteção do Access. O código também verifica o e-mail administrativo, mas a barreira do Access deve existir na borda.

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

Não bloqueie o site público com Cloudflare Access. A proteção deve valer somente para `/admin*` e `/api/admin*`, ou os robôs do Google não conseguirão acessar as páginas.

## 10. Diagnóstico rápido

- Erro de banco: confirme que o binding D1 se chama `DB` e que o `database_id` está correto.
- Imagens ou PDFs não enviam: confirme que o binding R2 se chama `BUCKET` e aponta para `orgus-files`.
- Painel redireciona ou nega acesso: confirme a proteção dos dois caminhos e o e-mail `contato@orgus.com.br` na política do Access.
- Uma página abre, mas os links não navegam: limpe o cache da publicação e confirme que o último commit foi implantado.

## Referências oficiais

- Workers Builds: https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
- Cloudflare D1: https://developers.cloudflare.com/d1/get-started/
- Migrações D1: https://developers.cloudflare.com/d1/reference/migrations/
- R2 em Workers: https://developers.cloudflare.com/r2/api/workers/workers-api-usage/
- Cloudflare Access: https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/
