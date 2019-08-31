use ithink3;

select*from product;
select*from cart;
select * from users;


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
    status varchar(255),
    thumbnail varchar(255),
    description longtext not null,
    foreign key (category_id) references category(id)
    on update cascade
    on delete cascade
    );
    
update product set status = true where id < 100;
    



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
    
create table cart (
	id int primary key auto_increment not null,
    user_id int not null,
    product_id int not null,
    qty_S int not null,
    qty_M int not null,
    qty_L int not null,
    qty_XL int not null,
    foreign key (user_id) references users(id)
    on update cascade
    on delete cascade,
    foreign key (product_id) references product(id)
    on update cascade
    on delete cascade
    );
    
create table checkout(
	id int not null primary key auto_increment,
	user_id int not null,
    total_price int not null,
    total_weight int not null,
    order_status enum('waiting payment', 'rejected','processing', 'sent' ),
    order_address varchar(255),
    order_name varchar(255),
    order_phonenumber varchar(255),
    order_awb varchar(30),
    proof_of_payment varchar(255),
    created_at timestamp,
    updated_at timestamp,
    foreign key (user_id) references users(id)
    on update cascade
    on delete cascade
    );
    
create table checkout_details (
	id int not null primary key auto_increment,
    checkout_id int not null,
    product_name varchar(255) not null,
    product_price int(7) not null,
    product_category varchar(255) not null,
    qty_S int not null,
    qty_M int not null,
    qty_L int not null,
    qty_XL int not null,
    thumbnail varchar(255),
    created_at timestamp,
    updated_at timestamp,
    foreign key (checkout_id) references checkout(id)
    on update cascade
    on delete cascade
);

    

    



    

    
    

    
    
    