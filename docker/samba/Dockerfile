FROM alpine:3.10.2

RUN apk add --no-cache --update \
  samba-common-tools \
  samba-client \
  samba-server \
  bash \
  && rm -rf /var/cache/apk/*


RUN addgroup -g 1000 test && \
  adduser -u 1000 -G test -D test

RUN mkdir /var/opt/samba && chown -R test:test /var/opt/samba

COPY smb.conf /etc/samba/smb.conf
RUN echo -e "TEST123\nTEST123" | smbpasswd -s -a test

EXPOSE 445/tcp

CMD ["smbd", "--foreground", "--log-stdout", "--no-process-group"]
