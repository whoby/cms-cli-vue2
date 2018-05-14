#FROM gliderlabs/alpine:3.3
FROM mhart/alpine-node:8.9.4

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories
RUN sed -i 's/alpine.gliderlabs.com/mirrors.ustc.edu.cn/g' /etc/apk/repositories

RUN npm config set registry  http://registry.npm.taobao.org && \
npm config set sass-binary-site  http://npm.taobao.org/mirrors/node-sass && \
npm config set phantomjs_cdnurl  http://npm.taobao.org/mirrors/phantomjs/ && \
npm config set chromedriver_cdnurl http://npm.taobao.org/mirrors/chromedriver

RUN mkdir /app
COPY . /app
WORKDIR /app
RUN npm i

EXPOSE 8085
CMD ["npm", "start"]
