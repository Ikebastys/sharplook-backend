import sqlite3

con = sqlite3.connect("sharplook.db")
rows = con.execute("select name from sqlite_master where type='table'").fetchall()
print(rows)
