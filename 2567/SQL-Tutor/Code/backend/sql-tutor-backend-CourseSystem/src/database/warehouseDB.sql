-- SQLite-Compatible Dump for warehouseDB

-- Table: categories
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
  CategoryID INTEGER PRIMARY KEY AUTOINCREMENT,
  CategoryName TEXT NOT NULL
);
INSERT INTO categories VALUES
(1,'Electronics'),(2,'Furniture'),(3,'Clothing'),(4,'Food'),(5,'Toys'),(6,'Books'),(7,'Office Supplies');

-- Table: companies
DROP TABLE IF EXISTS companies;
CREATE TABLE companies (
  CompanyID INTEGER PRIMARY KEY AUTOINCREMENT,
  CompanyName TEXT NOT NULL
);
INSERT INTO companies VALUES
(1,'Company A'),(2,'Company B'),(3,'Company C'),(4,'Company D'),(5,'Company E'),(6,'Company F'),(7,'Company G');

-- Table: warehouses
DROP TABLE IF EXISTS warehouses;
CREATE TABLE warehouses (
  WarehouseID INTEGER PRIMARY KEY AUTOINCREMENT,
  WarehouseName TEXT NOT NULL,
  Location TEXT NOT NULL
);
INSERT INTO warehouses VALUES
(1,'Warehouse 1','Location 1'),(2,'Warehouse 2','Location 2'),(3,'Warehouse 3','Location 3'),(4,'Warehouse 4','Location 4'),(5,'Warehouse 5','Location 5');

-- Table: "status" (SQLite keyword)
DROP TABLE IF EXISTS "status";
CREATE TABLE "status" (
  StatusID INTEGER PRIMARY KEY AUTOINCREMENT,
  StatusName TEXT NOT NULL
);
INSERT INTO "status" VALUES
(1,'Received'),(2,'In Transit'),(3,'Delivered'),(4,'Returned'),(5,'Pending'),(6,'Canceled');

-- Table: products
DROP TABLE IF EXISTS products;
CREATE TABLE products (
  ProductID INTEGER PRIMARY KEY AUTOINCREMENT,
  ProductName TEXT NOT NULL,
  CategoryID INTEGER,
  DateReceived DATE,
  StatusID INTEGER,
  WarehouseID INTEGER,
  CompanyID INTEGER
);
INSERT INTO products VALUES
(1,'Product 1',1,'2023-07-01',1,1,1),
(2,'Product 2',2,'2023-07-02',2,2,2),
(3,'Product 3',3,'2023-07-03',3,3,3),
(4,'Product 4',4,'2023-07-04',4,1,4),
(5,'Product 5',1,'2023-07-05',1,2,2),
(6,'Product 6',2,'2023-07-06',2,3,3),
(7,'Product 7',3,'2023-07-07',3,1,4),
(8,'Product 8',4,'2023-07-08',4,2,1),
(9,'Product 9',5,'2023-07-09',1,3,5),
(10,'Product 10',6,'2023-07-10',2,4,6);

-- Table: inventory
DROP TABLE IF EXISTS inventory;
CREATE TABLE inventory (
  InventoryID INTEGER PRIMARY KEY AUTOINCREMENT,
  ProductID INTEGER,
  WarehouseID INTEGER,
  Quantity INTEGER,
  LastUpdated DATE
);
INSERT INTO inventory VALUES
(1,1,1,100,'2023-07-01'),
(2,2,2,150,'2023-07-02'),
(3,3,3,200,'2023-07-03'),
(4,4,1,50,'2023-07-04'),
(5,5,2,120,'2023-07-05'),
(6,6,3,180,'2023-07-06'),
(7,7,1,90,'2023-07-07'),
(8,8,2,70,'2023-07-08'),
(9,9,3,160,'2023-07-09'),
(10,10,4,140,'2023-07-10');

-- Table: shipments
DROP TABLE IF EXISTS shipments;
CREATE TABLE shipments (
  ShipmentID INTEGER PRIMARY KEY AUTOINCREMENT,
  ProductID INTEGER,
  ShipmentDate DATE,
  SourceWarehouseID INTEGER,
  DestinationLocation TEXT,
  Quantity INTEGER,
  StatusID INTEGER
);
INSERT INTO shipments VALUES
(1,1,'2023-07-05',1,'Destination 1',50,2),
(2,2,'2023-07-06',2,'Destination 2',70,2),
(3,3,'2023-07-07',3,'Destination 3',100,3),
(4,4,'2023-07-08',1,'Destination 4',30,4),
(5,5,'2023-07-09',2,'Destination 5',60,1),
(6,6,'2023-07-10',3,'Destination 6',80,2),
(7,7,'2023-07-11',1,'Destination 7',90,3),
(8,8,'2023-07-12',2,'Destination 8',70,4),
(9,9,'2023-07-13',3,'Destination 9',100,1),
(10,10,'2023-07-14',4,'Destination 10',110,2);
