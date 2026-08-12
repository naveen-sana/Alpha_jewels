@echo off
set MYSQL="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
%MYSQL% -u root -p -e "SHOW DATABASES;" 2>NUL && echo EMPTY_PASS
%MYSQL% -u root -proot -e "SHOW DATABASES;" 2>NUL && echo PASS_ROOT
%MYSQL% -u root -padmin -e "SHOW DATABASES;" 2>NUL && echo PASS_ADMIN
%MYSQL% -u root -ppassword -e "SHOW DATABASES;" 2>NUL && echo PASS_PASSWORD
%MYSQL% -u root -p1234 -e "SHOW DATABASES;" 2>NUL && echo PASS_1234
%MYSQL% -u root -p123456 -e "SHOW DATABASES;" 2>NUL && echo PASS_123456
%MYSQL% -u root -pnaveen -e "SHOW DATABASES;" 2>NUL && echo PASS_NAVEEN
%MYSQL% -u root -pNaveen@123 -e "SHOW DATABASES;" 2>NUL && echo PASS_NAVEEN123
%MYSQL% -u root -proot123 -e "SHOW DATABASES;" 2>NUL && echo PASS_ROOT123
%MYSQL% -u root -pSql@123 -e "SHOW DATABASES;" 2>NUL && echo PASS_SQL123
