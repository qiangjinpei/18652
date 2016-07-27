
use mydata;
drop table messages;


create table messages(
	m_id int(11) NOT NULL AUTO_INCREMENT,
	username varchar(10) NOT NULL,
	messages varchar(500),
	messagetime varchar(50),
    primary key (m_id)
);

