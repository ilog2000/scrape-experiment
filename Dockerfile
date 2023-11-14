FROM node:alpine
USER node
WORKDIR /usr/src/app
COPY --chown=node:node . .
RUN npm install
RUN chmod +x ./node_modules/.bin/*
RUN npm run build
EXPOSE 5000
CMD ["node", "./packages/backend/dist/index.js"]
