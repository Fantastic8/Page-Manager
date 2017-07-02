select * from sys.tables;

/*Select table*/
select * from UserAccount;
select * from PageHead;
select * from PageBody;
select * from CSS;

/*Page Head test*/
insert into PageHead values(2,'H','2016-06-15','H',NULL);
insert into PageHead values(1,'A','2016-06-15','H',NULL);
delete from PageHead where PageID=2;

select Content from PageBody where PageID=1 and Position='Head';

/*quick account*/
insert into UserAccount values('Sa','123456',1,1);
update UserAccount set IsValid=1 where Account='Mark';
update UserAccount set IsManager=1,IsValid=1 where Account='Sa';
update PageHead set ExternalLabel=NULL where PageID=1;

delete from CSS where PageID=0 and CSS.Object='#LogOut';

delete from CSS where PageID=0 and Object='span';



/*Delete All tables*/
drop table UserAccount;
drop table PageBody;
drop table CSS;
drop table PageHead;