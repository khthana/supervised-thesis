FROM postgres:17.2-alpine

COPY learnifydb.sql /docker-entrypoint-initdb.d/
COPY scripts/initusr.sh /docker-entrypoint-initdb.d/

COPY config/postgresql.conf /etc/postgresql/postgresql.conf
COPY config/pg_hba.conf /etc/postgresql/pg_hba.conf

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]
