# checklist-frontend/Dockerfile

FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build

RUN npm install -g serve


CMD ["serve", "-s", "build"]
