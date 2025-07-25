@echo off
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p"Nvdigsri969" -e "DROP DATABASE IF EXISTS GarmentsDB;"
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p"Nvdigsri969" < database.sql
pause 