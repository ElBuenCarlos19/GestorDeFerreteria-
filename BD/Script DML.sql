-- Inserts Tabla Role
INSERT INTO Role (NameRole, Description) 
VALUES ('Admin', 'Administrator with full permissions'),
('Facturero','Cashier and Invoice worker'),
('Bodeguero','Worker in charge of the warehouse and office')

-- Inserts Tabla Users
INSERT INTO Users (Names, LastNames, Identification, Email, Username, Password, RoleID) 
VALUES ('David', 'Guzman', 123456789, 'davidg@gmail.com', 'admin', 'admin', 1);

--Inserts Tabla Client
INSERT INTO Client (Names,LastNames,Identification,Address,PhoneNumber,Email)
VALUES ('Carlos Alberto','Peralta Navarro','123456780','Calle 30 #20 - 60','3134324453','carlosp@gmail.com'),
('Marcela Patricia','Muñoz Florez','123456783','Calle 43 #02 - 06','3142123567','marcelap@gmail.com')

INSERT INTO Provider (ProviderName,ProviderAddress,PhoneNumber)
VALUES ('Proveedor XYZ','Calle 30','3303234')

--Inserts Tabla Product_Inventory
INSERT INTO Product_Inventory (UserID,ProviderID,ProductCode,ProductName,Description,Quantity,Price)
VALUES (1,1,'EX235421','Caja x25 tornillos','Caja de 25 tornillos marca Ferreter',20,23500)

--Inserts Tabla Invoice
INSERT INTO Invoice (ClientID,UserID,TotalAmount,PaymentMethod)
VALUES (1,1,0,'Efectivo')

-- Inserta un nuevo detalle de la factura
INSERT INTO InvoiceDetail (InvoiceID, ProductInventoryID, Quantity, UnitPrice, TotalPrice)
VALUES (1, 1, 5, (SELECT Price FROM Product_Inventory WHERE ProductInventoryID = 1),
(SELECT Price FROM Product_Inventory WHERE ProductInventoryID = 1) * 5);

-- Actualiza el TotalAmount
UPDATE Invoice 
SET TotalAmount = (SELECT SUM(TotalPrice) FROM InvoiceDetail WHERE InvoiceID = 1)
WHERE InvoiceID = 1;
