create table Role (
    RoleID int AUTO_INCREMENT,
    NameRole varchar(100) not null,
    Description varchar(200) not null,
    primary key(RoleID)
)

create table Users(
    UserID int AUTO_INCREMENT,
    Names varchar(100) not null,
    LastNames varchar(100) not null,
    Identification int(10) not null unique,
    Email varchar(100) not null unique,
    Username varchar(100) not null unique,
    Password varchar(100) not null,
    RoleID int not null,
    primary key(UserID),
    foreign key(RoleID) references Role(RoleID)
)

create table Client(
    ClientID int AUTO_INCREMENT,
    Names varchar(100) not null,
    LastNames varchar(100) not null,
    Identification int(10) not null unique,
    Address varchar(100) not null,
    PhoneNumber varchar(10) not null,
    primary key(ClientID),
)

create table Invoice(
    InvoiceID int AUTO_INCREMENT,
    ClientID int not null,
    UserID int not null,
    DateTime timestamp default current_timestamp on update current_timestamp,
    TotalAmount decimal(10, 2) not null,
    PaymentMethod varchar(100) not null,
    primary key(InvoiceID),
    foreign key(ClientID) references Client(ClientID),
    foreign key(UserID) references Users(UserID)
)

create table Provider(
    ProviderID int AUTO_INCREMENT,
    ProviderName varchar(100) not null,
    ProviderAddress varchar(100) not null,
    PhoneNumber varchar(50) not null,
    primary key(ProviderID)
)

create table Product_Inventory(
    ProductInventoryID int AUTO_INCREMENT,
    UserID int not null,
    ProviderID int not null,
    ProductCode varchar(200) not null unique,
    ProductName varchar(150) not null,
    Description varchar(150) not null,
    Quantity int not null,
    primary key(ProductInventoryID),
    foreign key(UserID) references Users(UserID),
    foreign key(ProviderID) references Provider(ProviderID)
)

create table InvoiceDetail(
    InvoiceDetailID int AUTO_INCREMENT,
    InvoiceID int not null,
    ProductInventoryID int not null,
    Quantity int not null,
    UnitPrice decimal(10, 2) not null,
    TotalPrice decimal(10, 2) not null,
    primary key(InvoiceDetail),
    foreign key(InvoiceID) references Invoice(InvoiceID),
    foreign key(ProductInventoryID) references Product_Inventory(ProductInventoryID)
)