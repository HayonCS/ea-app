FROM ubuntu:20.04

RUN apt-get update && apt-get install -y \
  curl \
  rlwrap \
  gnupg \
  build-essential \
  git \
  vim \
  zip \
  unzip \
  sudo

ENV NODE_VERSION 18.17.0

RUN ARCH= && dpkgArch="$(dpkg --print-architecture)" \
  && case "${dpkgArch##*-}" in \
  amd64) ARCH='x64';; \
  ppc64el) ARCH='ppc64le';; \
  s390x) ARCH='s390x';; \
  arm64) ARCH='arm64';; \
  armhf) ARCH='armv7l';; \
  i386) ARCH='x86';; \
  *) echo "unsupported architecture"; exit 1 ;; \
  esac \
  && set -ex \
  && curl -fsSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-$ARCH.tar.xz" \
  && tar -xJf "node-v$NODE_VERSION-linux-$ARCH.tar.xz" -C /usr/local --strip-components=1 --no-same-owner \
  && rm "node-v$NODE_VERSION-linux-$ARCH.tar.xz" \
  && ln -s /usr/local/bin/node /usr/local/bin/nodejs

RUN curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash

# RUN nvm install 18.17.0

ENV YARN_VERSION 1.22.19

RUN set -ex \ 
  && curl -fsSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
  && mkdir -p /opt \
  && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
  && ln -s /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
  && ln -s /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
  && rm yarn-v$YARN_VERSION.tar.gz

# Development environment utilities
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
  telnet \
  net-tools \
  iputils-ping \
  htop \
  bash-completion \
  time \
  tzdata \
  netcat-traditional \
  lsof \
  dnsutils \
  smbclient \
  subversion

# MSSQL CLI
# https://github.com/dbcli/mssql-cli/blob/master/doc/installation/pip.md#install-ubuntu--debian--mint
# We were having issues installing mssql-cli with apt-get so we are using pip for now
# https://github.com/dbcli/mssql-cli/issues/456
RUN apt-get update & apt-get install -y libunwind8 python-pip
RUN apt-get install -y libicu60 2> /dev/null || apt-get install -y libicu57 2> /dev/null || apt-get install -y libicu55 2> /dev/null || apt-get install -y libicu55 2> /dev/null || apt-get install -y libicu52
RUN pip install mssql-cli

# VSCode Live Share dependencies
#RUN apt-get update && apt-get install -y \
# wget

#RUN wget -O ~/vsls-reqs https://aka.ms/vsls-linux-prereq-script && chmod +x ~/vsls-reqs && ~/vsls-reqs

RUN groupadd -g 1000 dev && \
  adduser --uid 1000 --gid 1000 --disabled-password dev

# Get Eastern Time zone in the container
RUN ln -fs /usr/share/zoneinfo/America/New_York /etc/localtime
RUN dpkg-reconfigure --frontend noninteractive tzdata

# If dev user needs to be sudo, the following can be uncommented
RUN usermod -a -G sudo dev
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Allow for persistent personalization of the development environment
RUN mkdir /home/dev/app \
  && mkdir /home/dev/config \
  && mkdir /home/dev/config/ssh \
  && ln -s /home/dev/config/ssh /home/dev/.ssh \
  && mkdir -p /home/dev/config/vscode-server \
  && ln -s /home/dev/config/vscode-server /home/dev/.vscode-server \
  && echo "[include]\n  path = /home/dev/config/gitconfig" >> /home/dev/.gitconfig \
  && echo "\n/usr/local/lib/container-init\n\n" >> /home/dev/.bashrc \
  && ln -s /home/dev/config/netrc /home/dev/.netrc \
  && ln -s /home/dev/config/local /home/dev/.local \
  && ln -s /home/dev/config/vimrc /home/dev/.vimrc \
  && echo "\nif [ -f /home/dev/config/bashrc ]; then\n  . /home/dev/config/bashrc\nfi" >> /home/dev/.bashrc

COPY container-init /usr/local/lib
COPY tail-and-wait /usr/local/lib
COPY project-init /usr/local/bin

ENV HISTFILE=/home/dev/config/histfile
ENV PATH="/opt/mssql-tools/bin:/home/dev/app/node_modules/.bin:/home/dev/app/util/dev-bin:/home/dev/config/bin:${PATH}:/home/dev/app/.local/bin"
ENV NODE_ENV=development
ENV LANG C.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL C.UTF-8
WORKDIR /home/dev/app

ENV DOCKER_ENVIRONMENT	1

RUN chown -R dev:dev /home/dev
USER dev
