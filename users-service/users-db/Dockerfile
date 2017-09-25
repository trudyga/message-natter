FROM mysql:5.7

ENV MYSQL_DATABASE = MessageNatterUsers
ENV MYSQL_USER = MessageNatterUsersService
ENV MYSQL_PASSWORD = MessageNatterUsersService
ENV MYSQL_RANDOM_ROOT_PASSWORD = yes

RUN sed -i "s/^#bind-address.*$/bind-address = 0.0.0.0/" /etc/mysql/my.cnf
RUN sed -i "s/*pid-file/# pid-file/" /etc/mysql/my.cnf
RUN sed -i "s/^socket/# socket/#" /etc/mysql/my.cnf

EXPOSE 3306

CMD ["mysqld"]