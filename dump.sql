-- MySQL dump 10.13  Distrib 8.4.11, for Linux (x86_64)
--
-- Host: localhost    Database: coldplace
-- ------------------------------------------------------
-- Server version	8.4.11-0ubuntu0.26.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned DEFAULT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` int unsigned DEFAULT NULL,
  `old_value` text COLLATE utf8mb4_unicode_ci,
  `new_value` text COLLATE utf8mb4_unicode_ci,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_audit_created` (`created_at`),
  KEY `idx_audit_user` (`user_id`,`created_at`),
  KEY `idx_audit_entity` (`entity`,`entity_id`),
  KEY `idx_audit_action` (`action`,`created_at`),
  CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,NULL,'auth.refresh_failed','users',NULL,NULL,NULL,'unknown_token','127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 09:38:22'),(2,1,'auth.login','users',1,NULL,NULL,NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 09:39:13'),(3,1,'user.created','users',2,NULL,'{\"name\":\"Anita Obi\",\"email\":\"anita@coldplace.com\",\"role\":\"manager\",\"location_id\":1}',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 09:42:18'),(4,1,'auth.logout','users',1,NULL,NULL,NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 09:43:59'),(5,2,'auth.login','users',2,NULL,NULL,NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 09:44:47'),(6,2,'user.password_changed','users',2,NULL,'{\"must_change_password\":false}',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 09:45:25'),(7,2,'auth.login','users',2,NULL,NULL,NULL,'127.0.0.1','HTTPie/3.2.4','2026-11-11 10:55:01'),(8,2,'auth.logout','users',2,NULL,NULL,NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 14:20:19'),(9,1,'auth.login','users',1,NULL,NULL,NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 14:20:38'),(10,1,'user.created','users',3,NULL,'{\"name\":\"Adamu Arewa\",\"email\":\"adamu@coldplace.com\",\"role\":\"viewer\",\"location_id\":null}',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 14:21:42'),(11,1,'auth.logout','users',1,NULL,NULL,NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 14:21:56'),(12,3,'auth.login','users',3,NULL,NULL,NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 14:22:14'),(13,3,'user.password_changed','users',3,NULL,'{\"must_change_password\":false}',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 14:22:36'),(14,3,'auth.logout','users',3,NULL,NULL,NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 14:23:31'),(15,1,'auth.login','users',1,NULL,NULL,NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 14:23:49'),(16,1,'user.created','users',4,NULL,'{\"name\":\"Moyo Akio\",\"email\":\"moyo@coldplace.com\",\"role\":\"outlet\",\"location_id\":2}',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 20:32:41'),(17,1,'auth.logout','users',1,NULL,NULL,NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 20:32:53'),(18,4,'auth.login','users',4,NULL,NULL,NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 20:33:14'),(19,4,'user.password_changed','users',4,NULL,'{\"must_change_password\":false}',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 20:33:51'),(20,4,'auth.logout','users',4,NULL,NULL,NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 20:34:07'),(21,1,'auth.login','users',1,NULL,NULL,NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 20:34:25'),(22,1,'user.password_reset','users',4,NULL,NULL,NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 20:40:38'),(23,1,'auth.logout','users',1,NULL,NULL,NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 20:40:49'),(24,4,'auth.login','users',4,NULL,NULL,NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 20:41:13'),(25,4,'user.password_changed','users',4,NULL,'{\"must_change_password\":false}',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 20:41:32'),(26,4,'auth.logout','users',4,NULL,NULL,NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 20:42:07'),(27,2,'auth.login','users',2,NULL,NULL,NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-11 20:42:28');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_central` tinyint(1) NOT NULL DEFAULT '0',
  `address` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  CONSTRAINT `chk_loc_status` CHECK ((`status` in (_utf8mb4'active',_utf8mb4'inactive')))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'Central Area',1,NULL,'active'),(2,'Gwarimpa',0,NULL,'active'),(3,'Mpape',0,NULL,'active');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `token_hash` char(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` bigint NOT NULL,
  `revoked_at` bigint DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_token_hash` (`token_hash`),
  KEY `fk_rt_user` (`user_id`),
  CONSTRAINT `fk_rt_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,1,'531932aa7aaef3b7eaa5c01513433e04aafdcf8341e83fd146c0f4e42e20fc03',1795685953,1794390239,'2026-11-11 09:39:13'),(2,2,'f5cffe81ed75a834d17452443aa31bb831fc63b1d8e8e0bc08a8f68b67ed7685',1795686287,1794390325,'2026-11-11 09:44:47'),(3,2,'54c7b122f0ce7ebfef6d7fbb39d044fef06542e2d1c611ef1c0dde128df90b4c',1795686325,1794390325,'2026-11-11 09:45:25'),(4,2,'790f610bf9deef37d9819d0f220f19288442cbd6f5607d844b0443ca666f6981',1795686325,1794390538,'2026-11-11 09:45:25'),(5,2,'9e67ef31fc8c324538d4fbb59b902f292333dc3b584d5ebf7a5966b257a1278a',1795686538,1794390760,'2026-11-11 09:48:58'),(6,2,'d9c4de24509ac74c387c4882adf85fd3fadbc41f566f92b5300e6bcd89fa7acf',1795686760,1794393891,'2026-11-11 09:52:40'),(7,2,'eafb39e2fd935822ee34014904fa5430ce763a960466e63d218df186cd9b3cc2',1795689891,1794394683,'2026-11-11 10:44:51'),(8,2,'b74ae8e92465b91a42388783a29c1b500b50aa114644661a6a1406290aef00c2',1795690501,NULL,'2026-11-11 10:55:01'),(9,2,'53acc3d6a6a57251db1dd23fa158822e283cdf79c9d7a722d77304ec45cbd519',1795690683,1794394905,'2026-11-11 10:58:03'),(10,2,'48657da1f0925bfc65a02be16ebb3a5766f7b2a4ce6c10af2daaaa174753d570',1795690905,1794394929,'2026-11-11 11:01:45'),(11,2,'5d5417d22167a0298546f77d7fc7acba92ca65f3d3243ff2fc204f7754d0874a',1795690929,1794394943,'2026-11-11 11:02:09'),(12,2,'75ef79712ee63f3a01597c5094ad416b3f6b5d186de65c3c71eff8912d8327c2',1795690943,1794395690,'2026-11-11 11:02:23'),(13,2,'ba89c3352dd7c297f8da3cb653f4b4850ae2b68a345fb4855eec1d34a84d4664',1795691690,1794395737,'2026-11-11 11:14:50'),(14,2,'b5d498f3c905e98a26f7814ff0a30562282dc649040bd7a969a2bc2af67dcea8',1795691737,1794395750,'2026-11-11 11:15:37'),(15,2,'10347c710a393d1f28b7946d3bbebcc826abc0d3d87a2cfd297ee74c14a2ec9f',1795691750,1794396500,'2026-11-11 11:15:50'),(16,2,'c555d2917c5df1a0bb5d0c7d627bb01b609f9beeab48a5bfb0f9d0b5298ed2be',1795692500,1794397202,'2026-11-11 11:28:20'),(17,2,'598a0871a7bd0ab0a1bc214ef17c60636dfedaca4da560224c96ec4d1c454ef4',1795693202,1794397206,'2026-11-11 11:40:02'),(18,2,'d0baa87785f37db1d230c9b541338c1f1a9581a51d007d3eed786f4c47f51608',1795693206,1794397234,'2026-11-11 11:40:06'),(19,2,'79ab04abf91086ff0019fe971892176de8a42f11cd1613ec5a7bc183281c2fb0',1795693234,1794397492,'2026-11-11 11:40:34'),(20,2,'c8560578bf50f79abe9bc00aec7bfc3479b8f6e2180f56978d615db5b2e3a7d3',1795693492,1794397668,'2026-11-11 11:44:52'),(21,2,'99bd86cd0f02f1bf4e3e61e5a8c9b353d1c702b9457de4d639b0bae6f91bfca7',1795693668,1794397732,'2026-11-11 11:47:48'),(22,2,'8a6007d654e4784bcbfa9b83f7b3f841f3d61604619fe04d05b8117a1021abf5',1795693732,1794398215,'2026-11-11 11:48:52'),(23,2,'1332cba4dc3ee78011bd8db7f3bd391d54e9a35a2697ecb8d4c61b2c1034b44b',1795694215,1794399254,'2026-11-11 11:56:55'),(24,2,'ac8dd188a19ff500c423e799b8b35537125798ccdec32bc473c234a40a374340',1795695254,1794399506,'2026-11-11 12:14:14'),(25,2,'dfde5cc4c1c93ed96f947a30bfc3f0b3caad521b5394a980e97e6060b24d817a',1795695506,1794399987,'2026-11-11 12:18:26'),(26,2,'4799ff877394cae3414aafde3bb1f0f11358765ee625e6939dd4576056a42595',1795695987,1794401017,'2026-11-11 12:26:27'),(27,2,'54ab2115d7b190ab37619c0ad3211fc756f67d938c5a9d274a57a8887bb5fc3f',1795697017,1794401073,'2026-11-11 12:43:37'),(28,2,'9a1da57468658af57d0254ab389ad12b4ba803111d5a6e949917cbb098556104',1795697073,1794401112,'2026-11-11 12:44:33'),(29,2,'a23efdb01839a159971d62bc6cb854076e4d7942792dc6ed04b4db6f02a9d5b8',1795697112,1794404083,'2026-11-11 12:45:12'),(30,2,'5db329dea57e24f8f3a9f21df4b4fe5a30c036e02ccfa6717a93f1b460a75e08',1795700083,1794404212,'2026-11-11 13:34:43'),(31,2,'68091f308031a642afe3c39d79005413bf7c88611bfcd1fc7ef2b42dd8e8af14',1795700212,1794404515,'2026-11-11 13:36:52'),(32,2,'300759ca64e7efd6ecd33fcbcbca994e4d7e7b1b900eb063fd6a3137aeb0ae23',1795700515,1794404715,'2026-11-11 13:41:55'),(33,2,'f870a49ba33a0d3c2f13e69e94bf8fb026951e1b05708588b7b7db0ddc6f8ad5',1795700715,1794406041,'2026-11-11 13:45:15'),(34,2,'3fcbeb91c25b965fa87adfb7f47102314d67eb27fd69279cf3958e5bf9921463',1795702041,1794406149,'2026-11-11 14:07:21'),(35,2,'2fc50c034bee68d97fa6af5ca785c106ff771e8b27736e336d5602a011d8838e',1795702149,1794406159,'2026-11-11 14:09:09'),(36,2,'e6dd12f99449dbebc64e69e0216ef9ff901e51ff3c338f11e41c7b23ca375bc0',1795702159,1794406179,'2026-11-11 14:09:19'),(37,2,'80869bc6e0404acc1deedd47d20d630ec7cbcfd5c45d0f7deda1957943784b09',1795702179,1794406819,'2026-11-11 14:09:39'),(38,1,'63353ee500c0808e2a408f3698cd43ab911963cf9c8cf14d432a3ff3c1be8f29',1795702838,1794406916,'2026-11-11 14:20:38'),(39,3,'dffc472c5cdabb5c0d768d02813dd2c3cff73d342d20fc2b04bc150991caff53',1795702934,1794406956,'2026-11-11 14:22:14'),(40,3,'e6717f8918a9c5fe76dfcbc7cf36e847a30be7fd3d0d756bb04d52d4a882c1e7',1795702956,1794406956,'2026-11-11 14:22:36'),(41,3,'328b056c81339288c599c49ee44cb4fb4df42801e4e0acbc9fb54ae467e44435',1795702956,1794406994,'2026-11-11 14:22:36'),(42,3,'b15e08866f37cd7703a023119c59e7149f603de0384f23bed3a84667c31033c9',1795702994,1794407001,'2026-11-11 14:23:14'),(43,3,'006bcd75fdcd8521b4572312ee2e6fabe96dec561946daa54ea729ab92a8d220',1795703001,1794407011,'2026-11-11 14:23:21'),(44,1,'6c4026a6f0b151d8d1b7cc7888fb3d060a4662f2af652e7872a1d324d1eedf7c',1795703029,1794407344,'2026-11-11 14:23:49'),(45,1,'f35a23b8ffaa7e4000f3356853225ac6d275401d765a52c24de8ec37a34ac9d6',1795703344,1794407697,'2026-11-11 14:29:04'),(46,1,'88b1a405c20d73d07dd3c32a190c18133d59f8fb5fc8d6b243733a7f17c33669',1795703697,1794429071,'2026-11-11 14:34:57'),(47,1,'a901db45918129f85621be42ff1f43687a7b6b4d85c7c6681a6fbe6fef8042e8',1795725071,1794429173,'2026-11-11 20:31:11'),(48,4,'8522081d0e9cb75be41e7592735ee5d05a5633bb0c8ebfc2c7e0c155af6e6c7a',1795725194,1794429231,'2026-11-11 20:33:14'),(49,4,'20c871d739f141e2e542e5cc2ca6273996bf8cf24dc22358279231fb42bb34c0',1795725231,1794429231,'2026-11-11 20:33:51'),(50,4,'ed3b2ceeebfd6298b5ed5268c9064d7facb9268a139254d038a90772a0e6315f',1795725231,1794429247,'2026-11-11 20:33:51'),(51,1,'f7847835607efc34fceaaa867babcde6fbd266439f22b8e3367c849846c27b3d',1795725265,1794429554,'2026-11-11 20:34:25'),(52,1,'6cf85d56a3efbcaac7032a81642ebdac4fc5ae1cb859095b638ceb17af5478bf',1795725554,1794429607,'2026-11-11 20:39:14'),(53,1,'1a1163ff6b036fb04365b45cd501b603fca37e5633ad56679c3b51622f4411b1',1795725607,1794429649,'2026-11-11 20:40:07'),(54,4,'1e284612897853e855211157b19d5ec5bac1fd4e41c228c7c6adc6559090adae',1795725673,1794429692,'2026-11-11 20:41:13'),(55,4,'db22717058732257dd49025accf70fd850744f7e2a9ff8df5f9c27a68a8b74af',1795725692,1794429692,'2026-11-11 20:41:32'),(56,4,'25906f52ec6d16ac017c4bd72423c22845a42a7e9669c15e787d1b03f759c0af',1795725692,1794429727,'2026-11-11 20:41:32'),(57,2,'d78e172921e24f0d83458c4048179ae748de0dcd6c5946d3493482d4db2a39db',1795725748,1794472175,'2026-11-11 20:42:28'),(58,2,'346b5a9846a8b59fd92b9399b6286519e4c065105c8bccfa4359b19b3310f25d',1795768175,1794472195,'2026-11-12 08:29:35'),(59,2,'06d641b99b1a9a9defe22b46b22de18e86975720252898d6f804ef5a1ff5a5bd',1795768195,1794472631,'2026-11-12 08:29:55'),(60,2,'7a9c2194f4ce019e3cf2e71254209308e223f0713a5556881ed9178faa425c4f',1795768631,1794472776,'2026-11-12 08:37:11'),(61,2,'073b64786e25a9e541d91bf1b075a8318ed3b0b5cfb136e2be9a16aaa59289e3',1795768776,1794472898,'2026-11-12 08:39:36'),(62,2,'333b9076ac3f5ddf4d764e48d258d026ef430dd245187534eb9660fcf46e4557',1795768898,1794472967,'2026-11-12 08:41:38'),(63,2,'a39e359a918cf83d5cb6947881460bc8d1b7c6cec7c895fd9d56d876ce3735ff',1795768967,1794473025,'2026-11-12 08:42:47'),(64,2,'bb6a001d300a900b75ca593ff34f3c9ec481d571d022ce279c4da3b34c6ebec9',1795769025,1794473055,'2026-11-12 08:43:45'),(65,2,'374c9f648171ebdef8b3bc60ab1e4e0afa1cf35fa1d68f7234c00f963696a285',1795769055,1794473114,'2026-11-12 08:44:15'),(66,2,'89d1b89e804081045561a4fa75ba825cde51160693019db9475f85efbcb37f38',1795769114,1794473121,'2026-11-12 08:45:14'),(67,2,'06518bac7b0099a8ad734d9f92aa3bfcc734668e3d751829c23ffed6c416f06e',1795769121,1794473131,'2026-11-12 08:45:21'),(68,2,'af32550891e95486d6085278de3a7d5fc0583e1a3c5102620e5387a71aa5e9eb',1795769131,1794473266,'2026-11-12 08:45:31'),(69,2,'fbd09e7c3b78c17db99061eb8ba8ea47818eb847aab79efe3877f0a3d3772bf7',1795769266,1794473318,'2026-11-12 08:47:46'),(70,2,'73a8fbc2251bf1ba936b0c9422c919e77b34785dcad33e0abd32a117db6db21e',1795769318,1794473329,'2026-11-12 08:48:38'),(71,2,'e7045365fdc9732f8c9e57844728d3c25b94ff1ad81188a182a8eb13c27b8da3',1795769329,1794473352,'2026-11-12 08:48:49'),(72,2,'9f93ab959b204cb694f93c1d2a9315946f7c9b3b5548c8dc2038d6d2de4c2941',1795769352,1794473395,'2026-11-12 08:49:12'),(73,2,'06cd8628291c0a84c345ea82047ee7900d29623f755856087b2fb35012fd0d80',1795769395,1794473403,'2026-11-12 08:49:55'),(74,2,'ee3503339c903b8990c329f14fde62a10ff0d8509977a7683013966daa52bc38',1795769403,1794473425,'2026-11-12 08:50:03'),(75,2,'21f008a39a2065d0fe149e44e7bef2c33825e6256606cddce025199086138762',1795769425,1794473521,'2026-11-12 08:50:25'),(76,2,'672e939d467a2f60201277d1ce54176c623735b52e4a9102dd118f3bd878199d',1795769521,1794473887,'2026-11-12 08:52:01'),(77,2,'c42c226f54e854e93272ec6ae3210ed8c133e0a6b55517996f21978390c0e149',1795769887,1794473960,'2026-11-12 08:58:07'),(78,2,'9b5c58ab7a2282fc7765e4ca5df036838e5c4161d26c4f4142d5c7a5f1dcb386',1795769960,NULL,'2026-11-12 08:59:20');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location_id` int unsigned DEFAULT NULL,
  `is_primary_handler` tinyint(1) NOT NULL DEFAULT '0',
  `must_change_password` tinyint(1) NOT NULL DEFAULT '1',
  `status` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_user_location` (`location_id`),
  CONSTRAINT `fk_user_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_role` CHECK ((`role` in (_utf8mb4'executive',_utf8mb4'admin',_utf8mb4'manager',_utf8mb4'central',_utf8mb4'outlet',_utf8mb4'viewer'))),
  CONSTRAINT `chk_usr_status` CHECK ((`status` in (_utf8mb4'active',_utf8mb4'inactive')))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Root Admin','rootadmin@coldplace.com','$2y$12$BrCgIgkIblC6V1ZFxUfSq.88DsZUD4mORmfmzesEn3Qr6buS8.0U6','admin',NULL,0,0,'active'),(2,'Anita Obi','anita@coldplace.com','$2y$12$8CjTCftvxfAbe4ciJJkz7u/7b9YJ.0gwcRNdZfY5NIYMVqauXZZbS','manager',1,0,0,'active'),(3,'Adamu Arewa','adamu@coldplace.com','$2y$12$lXQ3bttW71W8M03I0fZI6uix2ccyhQOAKe2Y2RJ7cg.cdFA0ln3cO','viewer',NULL,0,0,'active'),(4,'Moyo Akio','moyo@coldplace.com','$2y$12$IJ.QjdCTZY65jrzuN5PHiO06ChEt7Z6QsIYjKIRJw0AfHJRYx.abS','outlet',2,0,0,'active');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-12 15:42:08
