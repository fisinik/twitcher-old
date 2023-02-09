# Twitcher

This is a web application for bird lovers to share their favorite feathered friends and learn about new sightings.

## Technologies

This is an app bootstrapped according to the [init.tips](https://init.tips) stack, also known as the T3-Stack. The stack includes the following modules:

- [Next-Auth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [TailwindCSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Getting Started

For a local development environment, you need to have [Node.js](https://nodejs.org/en/) installed.

First, install the dependencies:

```bash
npm/yarn install
```

Configure your local environment: copy the .env.local

```bash
cp .env.local.example .env.local
```

Run the development server:

```bash
# development mode
npm/yarn dev

# production mode
npm/yarn build
npm/yarn start
```

## Deploy on Vercel

The easiest way to deploy this app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Next.js](https://nextjs.org/docs/deployment) and [Next-Auth.js](https://next-auth.js.org/deployment) deployment documentation for more details.
