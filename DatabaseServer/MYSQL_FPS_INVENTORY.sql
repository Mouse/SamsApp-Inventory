DROP DATABASE IF EXISTS `fps_inventory`; 
CREATE DATABASE `fps_inventory`;
USE `fps_inventory`;
--
-- Table structure for table `checkouts`
--

DROP TABLE IF EXISTS `checkouts`;
CREATE TABLE `checkouts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `member_id` int(11) NOT NULL,
  `itemno` varchar(45) NOT NULL,
  `orderid` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `notes` TEXT NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `checkouts`
--

LOCK TABLES `checkouts` WRITE;
UNLOCK TABLES;

--
-- Table structure for table `fps_users`
--

DROP TABLE IF EXISTS `fps_users`;
CREATE TABLE `fps_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `fps_users`
--

LOCK TABLES `fps_users` WRITE;
INSERT INTO `fps_users` VALUES (1,'Sam Rodriguez');
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
CREATE TABLE `inventory` (
  `itemno` varchar(45) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  PRIMARY KEY (`itemno`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
INSERT INTO `inventory` VALUES ('02-10138','Upon Device Activation \"Do Not Enter\"\" Sign\"',5),('02-10139','Caution \"Do Not Enter\"\" Sign\"',2),('02-10314','\"Do Not Enter During or After Discharge\"\" Sign\"',8),('10-2452-1','PCB ASSY ONLY, SHP PRO, CA/SOL/SPRINKLER',0),('10-2453-R','ENCLOSURE ASSY, SHP PRO, RED',2),('10-2527-R-L','Cybercat 254 Red Enclosure',2),('10-2541-R','Cheetah Xi Enclosure Red',2),('10-2623-R','Cheetah Xi 50 Enclosure Red',3),('109848','Cheetah Controller',1),('173400','Cheetah Network Card',1),('209195','CyberCat 1016 System Contr (incl10-064-C-P)',2),('234761','Cheetah Xi 1016 System Controller',2),('263250','CyberCat 50 Controller (included with 10-070-C-P)',4),('263980','Cheetah Xi 50 System Cont incl 0-071-C-P',2),('267267','10 Button RDU Assembly',1),('55-021','Supervised Output Module (SOM) (NAC module)',3),('55-022','Solenoid Releasing Mod(SRM) (Operates Solenoids,',6),('55-023','Dual Relay Module (R2M)',1),('55-041','Monitor Module 4\" (EM-1SM)\"',8),('55-042','Supervised Control Module (EM-1SR)',4),('55-043','Relay Module (EM-1R)',3),('55-045','Mini Monitor Module (EM-1MM)',4),('55-046','Monitor Module 4\" w/ built in isolators\"',3),('55-052','Releasing Module (EM-1RM)',4),('55-056','Dual Monitor Module-Req Firmware 4.0 or Higher',3),('60-1027','135* Fixed/Rate of Rise Heat',4),('60-1028','Analog Sensor, Thermal',2),('60-1029','Detector, 135F Fixed, Rate of Rise**',5),('60-1039','Heat Sensor, 135-190 F (57-88 C) Fixed',4),('63-1014','Photo',4),('63-1024','Detector, Photoelectric *',4),('63-1052','Photo Sensor (ED-P)',9),('63-1053','Photo/135 F Heat Combination Sensor (ED-PT)',7),('63-1054','Sensor Base 6\" (EBF)\"',16),('63-1055','Sensor Base 4\" (EB)\"',1),('63-1057','Photo Duct Sensor (ED-DP)',13),('63-1058','Photo Sensor w/built in isolators',4),('63-1061','Sensor Base 4: w/ built in isolators',4),('67-1029','2-Wire Flange 24 VDC base',4),('67-1031','2-Wire Flange 12/24 VDC Base',0),('67-1043','2-WIRE FLANGE 12/24 VDC BASE',15),('BSL-1115','12V/18 AMP Batteries',0),('CPD-7052','Fenwal Smart Ion Detector',2),('DCP-R2ML','Elock Fire Circuit Lockout Kit w/Label and Key',1),('FAS-1075','12V7 AMP Battery',0),('FSL-751','Notifier Addressable Photo Detector',1),('FSP-851','Notifier Detector',1),('SE-F125-1','CAUTION',3),('SE-F125-2','HFC-125 EXTINGUISHING SYSTEM DISCHARGE ALARM',4),('SE-F125-3','HFC-125 ALARM SEQUENCE',7),('SE-F125-4','HFC-125 / PRE-ACTION CONTROL PANEL',23),('SE-F125-5','HFC-125 CONTROL PANEL',17),('SE-F125-6','HFC-125 1ST ALARM',10),('SE-F125-7','HFC-125 2ND ALARM',11),('SE-F227-1','CAUTION',6),('SE-F227-2','HFC 227EA EXTINGUISHING SYSTEM DISCHARGE ALARM',5),('SE-F227-3','HFC-227EA ALARM SEQUENCE',5),('SE-F227-4','HFC-227EA / PRE-ACTION CONTROL PANEL',11),('SE-F227-5','HFC-227EA CONTROL PANEL',8),('SE-F227-6','PRE-ACTION ALARM BELL',24),('SE-F227-7','HFC-227EA 2ND ALARM',24),('SE-FA -1','FIRE ALARM CONTROL PANEL',14),('SE-FCA-1 - 1','ZONE-1',10),('SE-FCA-1 - 2','ZONE-2',10),('SE-FCA-1 - 3','ZONE-3',10),('SE-IG55-1','CAUTION',9),('SE-IG55-2','IG-55 EXTINGUISHING SYSTEM DISCHARGE ALARM',9),('SE-IG55-3','IG-55 ALARM SEQUENCE',14),('SE-IG55-4','IG-55/PRE-ACTION CONTROL PANEL',9),('SE-IG55-5','IG-55 CONTROL PANEL',10),('SE-IG55-6','IG-55 1ST ALARM',10),('SE-IG55-7','IG-55 2ND ALARM',10),('SE-PA-1','PRE-ACTION CONTROL PANEL',12),('SE-PA-2','PRE-ACTION ALARM BELL',15),('SE-PA-3','WATERFLOW ALARM BELL',9),('SEC-1075','12V7 AMP Battery',2),('SLA-1104','12V/12 AMP Batteries',12),('SLA-1116','12V/18 AMP Batteries',8);
UNLOCK TABLES;

--
-- Table structure for table `noninventory`
--

DROP TABLE IF EXISTS `noninventory`;
CREATE TABLE `noninventory` (
  `itemno` varchar(45) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  PRIMARY KEY (`itemno`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
--
-- Dumping data for table `noninventory`
--

DELIMITER $$
USE `fps_inventory`$$

CREATE TRIGGER updateQuantitiesOnInsertTrigger 
	AFTER INSERT 
    ON `fps_inventory`.`checkouts` FOR EACH ROW
BEGIN
	UPDATE `fps_inventory`.`inventory` 
    SET qty = qty - NEW.qty
    WHERE itemno = NEW.itemno;
END$$

CREATE TRIGGER updateQuantitiesOnUpdateTrigger
	AFTER UPDATE
    ON `fps_inventory`.`checkouts` FOR EACH ROW
BEGIN
	UPDATE `fps_inventory`.`inventory` 
    SET qty = qty - (NEW.qty - OLD.qty)
    WHERE itemno = NEW.itemno;
END$$
    
DELIMITER ;

LOCK TABLES `noninventory` WRITE;
UNLOCK TABLES;

CREATE USER 'node_admin'@'localhost' IDENTIFIED BY 'Abc1@3!!';
ALTER USER 'node_admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Abc1@3!!';
GRANT ALL PRIVILEGES ON fps_inventory.* TO 'node_admin'@'localhost';
FLUSH PRIVILEGES;