FROM node:alpine
USER node
WORKDIR /usr/src/app
COPY --chown=node:node . .
RUN npm install
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
