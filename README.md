bbs
===

This bulletin board demo application illustrates the use of Node.js on Windows Azure, and a bunch of Node modules, including socket.io, express, nstore, msnodesql, and mongoose. There are five applications in this repository:

* bbs-ws -- a simple web application that uses nstore as the underlying data store.
* bbs-ts -- the same but uses Windows Azure Table Storage.
* bbs-vm -- the same but uses MongoDB, and is demonstrated using a Windows Azure Ubuntu Server VM.
* bbs-sql -- the same but uses SQL Server, and is demonstrated using a SQL Database on Windows Azure.
* bbs-ms -- a Windows Store (Windows 8) app that uses Windows Azure Mobile Services to connect to the same underlying SQL database as the bbs-sql web application.
