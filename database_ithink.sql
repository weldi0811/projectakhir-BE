create database ithink2;
use ithink2;

select * from category;
select * from product;

select * from product inner join category on product.category_id = category.id where category.id = 2;
select * from users;

select * from product;

create table users (
	id int primary key auto_increment,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    username varchar(20) not null unique,
    email varchar(20) not null unique,
    password varchar(1000) not null,
    verified boolean,
    phone_number varchar(15),
    avatar varchar(50)
    );
    
create table category(
	id int primary key auto_increment,
    category varchar(30)
    );

create table admin (
	 id int primary key auto_increment,
     admin_name varchar(20) unique not null,
     admin_pass varchar(16) not null
     );
    
create table product (
	id int primary key auto_increment,
    product_name varchar(30) not null,
    category_id int,
    stock_S int(3) default 0,
    stock_M int(3) default 0,
    stock_L int(3) default 0,
    stock_XL int(3) default 0,
    price int(7) not null,
    weight int(4) not null,
    foreign key (category_id) references category(id)
    on update cascade
    on delete cascade
    );
create table product_photos (
	id int primary key auto_increment,
    pp_product varchar(50),
    product_id_pp int not null,
    foreign key (product_id_pp) references product(id)
    on update cascade
    on delete cascade
    );
    
create table wishlist (
	id int primary key auto_increment,
    user_id_wishlist int not null,
    product_id_wishlist int not null,
    qty_wishlist int not null,
    foreign key (user_id_wishlist) references users(id)
    on update cascade
    on delete cascade,
    foreign key (product_id_wishlist) references product(id)
    on update cascade
    on delete cascade
    );
create table order_details (
	id int primary key auto_increment,
    user_id_od int not null,
    product_id_od int(3) null,
    qty_od_s int,
    qty_od_m int,
    qty_od_L int,
    qty_od_XL int,
    total_price_od int,
    total_weight_od int,
    foreign key (user_id_od) references users(id)
    on update cascade
    on delete cascade,
    foreign key (product_id_od) references product(id)
    on update cascade
    on delete cascade
    );
create table orders (
	id int primary key auto_increment,
    od_id int not null,
    user_id_orders int not null,
    product_id_orders int not null,
    total_price int,
	total_weight int,
    ship_address varchar(100),
    ship_city varchar(30),
    ship_postalcode varchar(8),
    ship_fee int,
    order_status varchar(15),
    resi varchar(30),
    foreign key (od_id) references order_details(id)
    on update cascade
    on delete cascade
    );
create table confirmation (
	id int primary key auto_increment,
    orders_id int,
    status varchar(20),
    foreign key (orders_id) references orders(id)
    on update cascade
    on delete cascade
    );
    
    
    
    