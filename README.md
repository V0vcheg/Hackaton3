# 🚀 Next.js App Starter

A boilerplate for a full-stack app using:

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma ORM](https://www.prisma.io/)
- Database via **Docker Compose**

---

## 🛠️ Stack

- **Framework:** Next.js (App Router)
- **UI:** shadcn/ui + Tailwind CSS
- **ORM:** Prisma
- **Database:** PostgreSQL (Docker Compose)

---

## 🧱 Prerequisites

- Node.js (v18+ recommended)
- Docker + Docker Compose
- pnpm / yarn / npm

---

## ⚙️ Getting Started

1. **Clone the repository**

    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2. **Install dependencies**

    ```bash
    pnpm install
    ```

3. **Start the database with Docker**

    ```bash
    docker-compose up -d
    ```

4. **Generate Prisma client**

    ```bash
    npx prisma generate
    ```

5. **Run database migrations**

    ```bash
    npx prisma migrate dev --name init
    ```

6. **Start the development server**

    ```bash
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🧪 Useful Commands

- **Introspect existing DB**

    ```bash
    npx prisma db pull
    ```

- **Open Prisma Studio (GUI for DB)**

    ```bash
    npx prisma studio
    ```

- **Format Prisma schema**

    ```bash
    npx prisma format
    ```

---

## 📦 Docker Compose Example

Add this to your root as `docker-compose.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    restart: always
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app_db
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
