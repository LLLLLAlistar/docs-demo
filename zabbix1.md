# Zabbix 服务端与客户端配置文档

## 一、Zabbix Server 配置

### 1. 安装必要的软件包

bash

```bash
rpm -Uvh https://repo.zabbix.com/zabbix/5.0/rhel/7/x86_64/zabbix-release-5.0-1.el7.noarch.rpm
```



### 2. 更换为阿里云镜像源

bash

```bash
sed -i 's/repo.zabbix.com/mirrors.aliyun.com\/zabbix/g' /etc/yum.repos.d/zabbix.repo
```



### 3. 安装 Zabbix 相关组件

bash

```bash
yum -y install zabbix-web-mysql-scl zabbix-apache-conf-scl
```



### 4. 数据库配置

#### 创建数据库并授权

bash

```bash
mysql -uroot -p"数据库的密码" -e 'create database zabbix character set utf8 collate utf8_bin;'
mysql -uroot -p"数据库的密码" -e "grant all privileges on zabbix.* to zabbix@localhost identified by 'password';"
```



#### 导入初始数据

bash

```bash
zcat /usr/share/doc/zabbix-server-mysql*/create.sql.gz | mysql -uroot -p"你的密码" zabbix
```



### 5. 配置 Zabbix Server

编辑配置文件 `/etc/zabbix/zabbix_server.conf`：

ini

```ini
LogFile=/var/log/zabbix/zabbix_server.log
LogFileSize=0
PidFile=/var/run/zabbix/zabbix_server.pid
SocketDir=/var/run/zabbix
DBHost=localhost
DBName=zabbix
DBPassword="数据库的密码"
SNMPTrapperFile=/var/log/snmptrap/snmptrap.log
Timeout=4
AlertScriptPath=/usr/lib/zabbix/alertscripts
ExternalScripts=/usr/lib/zabbix/externalscripts
LogSlowQueries=3000
```



### 6. 启动服务

bash

```bash
systemctl restart zabbix-server zabbix-agent httpd rh-php72-php-fpm
```



### 7. 默认登录信息

- 用户名：`Admin`
- 密码：`zabbix`

### 8. 解决中文乱码问题

bash

```bash
yum install -y wqy-microhei-fonts
\cp /usr/share/fonts/wqy-microhei/wqy-microhei.ttc /usr/share/fonts/dejavu/DejaVuSans.ttf
```



------

## 二、Zabbix Agent 配置

### 1. 安装 Zabbix Agent2

bash

```bash
rpm -Uvh https://repo.zabbix.com/zabbix/5.0/rhel/7/x86_64/zabbix-release-5.0-1.el7.noarch.rpm
sed -i 's/repo.zabbix.com/mirrors.aliyun.com\/zabbix/g' /etc/yum.repos.d/zabbix.repo
yum install zabbix-agent2 -y
```



### 2. 启用并启动服务

bash

```bash
systemctl enable --now zabbix-agent2
```



### 3. 配置 Agent

编辑 `/etc/zabbix/zabbix_agent2.conf`：

ini

```ini
Server=<server_ip_address>
Hostname=<hostname>
```



------

## 注意事项

- 请将 `<server_ip_address>` 替换为实际的 Zabbix Server IP 地址。
- 将 `<hostname>` 替换为当前主机的名称。
- 数据库密码建议使用更安全的强密码。