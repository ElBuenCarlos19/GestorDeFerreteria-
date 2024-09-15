-- Inserts Tabla Role
INSERT INTO Role (NameRole, Description) 
VALUES ('Admin', 'Administrator with full permissions');

-- Inserts Tabla Users
INSERT INTO Users (Names, LastNames, Identification, Email, Username, Password, RoleID) 
VALUES ('David', 'Guzman', 123456789, 'davidg@gmail.com', 'admin', 'admin', 1);

--14/09/24 Inserts Tabla Role
Insert INTO Role (NameRole, Description)
VALUES ('Admin2',"Administrator with full permissions"),
('Facturero','Cashier and Invoice worker'),
('Bodeguero','Worker in charge of the warehouse and office')

--Inserts Tabla Client
INSERT INTO Client (Names,LastNames,Identification,Address,PhoneNumber)
VALUES ('Carlos Alberto','Peralta Navarro','123456780','Calle 30 #20 - 60','3134324453'),
('Marcela Patricia','Muñoz Florez','123456783','Calle 43 #02 - 06','3142123567')

--Inserts Tabla Product_Inventory
INSERT INTO Product_Inventory (UserID,ProviderID,ProductCode,ProductName,Description,Quantity)
VALUES (1,1,'EX235421','Caja x25 tornillos','Caja de 25 tornillos marca Ferreter',20)

--Inserts Tabla Invoice
INSERT INTO Invoice (ClientID,UserID,TotalAmount,PaymentMethod)
VALUES (1,1,23500,'Efectivo')

--Inserts Tabla InvoiceDetail
INSERT INTO InvoiceDetail (InvoiceID,ProductInventoryID,Quantity,UnitPrice,TotalPrice)
VALUES (1,1,1,23500,23500)