####################
## BUILD FOR LOCAL DEVELOPMENT
####################
#
#FROM node:18-alpine As development
#
## Create app directory
#WORKDIR /usr/src/app
#
## Copy application dependency manifests to the container image.
## A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
## Copying this first prevents re-running npm install on every code change.
#COPY --chown=node:node package*.json ./
#
## Install app dependencies using the `npm ci` command instead of `npm install`
#RUN yarn install --frozen-lockfile
#
## Bundle app source
#COPY --chown=node:node . .
#
## Use the node user from the image (instead of the root user)
#USER node
#
####################
## BUILD FOR PRODUCTION
####################
#
#FROM node:18-alpine As build
#
#WORKDIR /usr/src/app
#
#COPY --chown=node:node package*.json ./
#
## In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
#COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
#
#COPY --chown=node:node . .
#
## Run the build command which creates the production bundle
#RUN yarn build
#
## Set NODE_ENV environment variable
#ENV NODE_ENV production
#
## Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
#RUN yarn install --frozen-lockfile --prod
#
#USER node
#
####################
## PRODUCTION
####################
#
#FROM node:18-alpine As production
#
## Copy the bundled code from the build stage to the production image
#COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
#COPY --chown=node:node --from=build /usr/src/app/dist ./dist
#
#COPY --chown=node:node --from=build /usr/src/app/.env ./.env
#
## Start the server using the production build
#CMD [ "node", "dist/main.js" ]

# Building layer
FROM node:16-alpine as development

# Optional NPM automation (auth) token build argument
# ARG NPM_TOKEN

# Optionally authenticate NPM registry
# RUN npm set //registry.npmjs.org/:_authToken ${NPM_TOKEN}

WORKDIR /usr/src/app

# Copy configuration files
COPY tsconfig*.json ./
COPY package*.json ./

# Install dependencies from package-lock.json, see https://docs.npmjs.com/cli/v7/commands/npm-ci
RUN npm install

# Copy application sources (.ts, .tsx, js)
COPY src/ src/

# Build application (produces dist/ folder)
RUN npm run build

# Runtime (production) layer
FROM node:16-alpine as production

# Optional NPM automation (auth) token build argument
# ARG NPM_TOKEN

# Optionally authenticate NPM registry
# RUN npm set //registry.npmjs.org/:_authToken ${NPM_TOKEN}

WORKDIR /usr/src/app

# Copy dependencies files
COPY package*.json ./

# Install runtime dependecies (without dev/test dependecies)
RUN npm ci --omit=dev

# Copy production build
COPY --from=development /usr/src/app/dist/ ./dist/

# Expose application port
EXPOSE 3000

# Start application
CMD [ "node", "dist/main.js" ]
