# Zabbix 配置完整指南

本文档详细介绍了如何配置 Zabbix 监控系统，包括服务器端、客户端以及邮件监控的配置步骤。



## Zabbix Server 配置

### 环境要求
部署 zabbix-server 需要以下组件：
- mysql
- zabbix-server-mysql
- zabbix-web-mysql-scl
- zabbix-apache-conf-scl

### 安装步骤

1. 添加 Zabbix 官方仓库
   ```bash
   rpm -Uvh https://repo.zabbix.com/zabbix/5.0/rhel/7/x86_64/zabbix-release-5.0-1.el7.noarch.rpm
   ```

2. 更换为阿里云镜像源（提高下载速度）
   ```bash
   sed -i 's/repo.zabbix.com/mirrors.aliyun.com\/zabbix/g' /etc/yum.repos.d/zabbix.repo
   ```

3. 安装相关组件
   ```bash
   yum -y install zabbix-web-mysql-scl zabbix-apache-conf-scl
   ```

### 数据库配置

1. 创建 Zabbix 数据库
   ```bash
   mysql -uroot -p123456 -e 'create database zabbix character set utf8 collate utf8_bin;'
   ```

2. 创建 Zabbix 用户并授权
   ```bash
   mysql -uroot -p123456 -e "grant all privileges on zabbix.* to zabbix@localhost identified by 'password';"
   ```

3. 导入初始数据
   ```bash
   zcat /usr/share/doc/zabbix-server-mysql*/create.sql.gz | mysql -uroot -p123456 zabbix
   ```

### 配置 Zabbix Server

编辑 `/etc/zabbix/zabbix_server.conf` 文件：

```conf
LogFile=/var/log/zabbix/zabbix_server.log
LogFileSize=0
PidFile=/var/run/zabbix/zabbix_server.pid
SocketDir=/var/run/zabbix
DBHost=localhost
DBName=zabbix
DBPassword=password
SNMPTrapperFile=/var/log/snmptrap/snmptrap.log
Timeout=4
AlertScriptPath=/usr/lib/zabbix/alertscripts
ExternalScripts=/usr/lib/zabbix/externalscripts
LogSlowQueries=3000
```

### 启动服务

重启相关服务使配置生效：
```bash
systemctl restart zabbix-server zabbix-agent httpd rh-php72-php-fpm
```

访问 Web 界面：http://192.168.x.x/zabbix

默认登录账号：
- 用户名：Admin
- 密码：zabbix

### 解决中文乱码问题

安装中文字体解决乱码：
```bash
yum install -y wqy-microhei-fonts
\cp /usr/share/fonts/wqy-microhei/wqy-microhei.ttc /usr/share/fonts/dejavu/DejaVuSans.ttf
```

## Zabbix Agent 配置

### 安装步骤

1. 添加 Zabbix 官方仓库
   ```bash
   rpm -Uvh https://repo.zabbix.com/zabbix/5.0/rhel/7/x86_64/zabbix-release-5.0-1.el7.noarch.rpm
   ```

2. 更换为阿里云镜像源
   ```bash
   sed -i 's/repo.zabbix.com/mirrors.aliyun.com\/zabbix/g' /etc/yum.repos.d/zabbix.repo
   ```

3. 安装 Zabbix Agent2
   ```bash
   yum install zabbix-agent2 -y
   ```

4. 启动并设置开机自启
   ```bash
   systemctl enable --now zabbix-agent2
   ```

### 配置文件修改

编辑 `/etc/zabbix/zabbix_agent2.conf` 文件：
```ini
Server=(填写zabbix服务器IP地址)
Hostname=(填写本机主机名)
```

## Zabbix 邮件监控配置

按照以下步骤配置邮件告警功能：

1. 在 Web 页面点击 **配置** → **主机** → **创建监控项**，设置好键值，点击添加

2. 点击 **配置** → **主机** → **创建触发器**

3. 点击 **配置** → **动作** → **创建动作**，添加触发器，添加操作为发送消息，仅发送为 email

4. 点击 **管理** → **媒介** → 点击 **Email**，设置 smtp.163.com，密码为邮箱授权码

5. 点击 **管理** → **媒介** → 报警媒介选择 Email，收件人为邮箱地址

---
*本文档基于 Zabbix 5.0 版本编写*