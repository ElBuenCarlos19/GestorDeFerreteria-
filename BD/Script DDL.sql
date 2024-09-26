CREATE TABLE Role (
    RoleID SERIAL,
    NameRole VARCHAR(100) NOT NULL,
    Description VARCHAR(200) NOT NULL,
    PRIMARY KEY (RoleID)
);

CREATE TABLE Users (
    UserID SERIAL,
    Names VARCHAR(100) NOT NULL,
    LastNames VARCHAR(100) NOT NULL,
    Identification INT NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Username VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(100) NOT NULL,
    RoleID INT NOT NULL,
    PRIMARY KEY (UserID),
    FOREIGN KEY (RoleID) REFERENCES Role(RoleID)
);

CREATE TABLE Client (
    ClientID SERIAL,
    Names VARCHAR(100) NOT NULL,
    LastNames VARCHAR(100) NOT NULL,
    Identification INT NOT NULL UNIQUE,
    Address VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(10) NOT NULL UNIQUE,
    PRIMARY KEY (ClientID)
);

CREATE TABLE Invoice (
    InvoiceID SERIAL,
    ClientID INT NOT NULL,
    UserID INT NOT NULL,
    DateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TotalAmount DECIMAL(10, 2) NOT NULL,
    PaymentMethod VARCHAR(100) NOT NULL,
    InvoiceCode VARCHAR(100) NOT NULL,
    PRIMARY KEY (InvoiceID),
    FOREIGN KEY (ClientID) REFERENCES Client(ClientID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE Provider (
    ProviderID SERIAL,
    ProviderName VARCHAR(100) NOT NULL,
    ProviderAddress VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(50) NOT NULL,
    PRIMARY KEY (ProviderID)
);

CREATE TABLE Product_Inventory (
    ProductInventoryID SERIAL,
    UserID INT NOT NULL,
    ProviderID INT NOT NULL,
    ProductCode VARCHAR(200) NOT NULL UNIQUE,
    ProductName VARCHAR(150) NOT NULL,
    Description VARCHAR(150) NOT NULL,
    Quantity INT NOT NULL,
    PRIMARY KEY (ProductInventoryID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ProviderID) REFERENCES Provider(ProviderID)
);

CREATE TABLE InvoiceDetail (
    InvoiceDetailID SERIAL,
    InvoiceID INT NOT NULL,
    ProductInventoryID INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10, 2) NOT NULL,
    TotalPrice DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (InvoiceDetailID),
    FOREIGN KEY (InvoiceID) REFERENCES Invoice(InvoiceID),
    FOREIGN KEY (ProductInventoryID) REFERENCES Product_Inventory(ProductInventoryID)
);