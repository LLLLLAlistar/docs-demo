# 利用Jumpserver在Linux上部署堡垒机

## 数据库配置

创建 JumpServer 数据库并授权用户：

```sql
CREATE DATABASE jumpserver DEFAULT CHARSET 'utf8' COLLATE 'utf8_bin';
CREATE USER 'jumpserver'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON jumpserver.* TO 'jumpserver'@'%' IDENTIFIED BY 'password';
```


## Python 3.6 环境安装

### 下载并解压 Python 3.6.10

bash

```bash
wget https://www.python.org/ftp/python/3.6.10/Python-3.6.10.tgz
tar zvxf Python-3.6.10.tgz
```



### 编译安装

bash

```bash
cd Python-3.6.10
mkdir /usr/local/python3
./configure --prefix=/usr/local/python3
make && make install
```



### 创建软链接

bash

```bash
mv /usr/bin/python /usr/bin/python_bak
ln -s /usr/local/python3/bin/python3 /usr/bin/python
```



### 配置环境变量

编辑 `/etc/profile`，添加：

bash

```bash
PATH=$PATH:$HOME/bin:/usr/local/python3/bin
```


## 虚拟环境配置

### 安装 virtualenv

bash

```bash
pip3 install virtualenv
```



### 创建虚拟环境

bash

```bash
virtualenv --python=python3 jumpserver_venv
```



### 激活与退出虚拟环境

bash

```bash
# 激活
source /root/jumpserver_venv/bin/activate

# 退出
deactivate
```



## JumpServer 安装与启动

### 官方文档

参考：[JumpServer 在线安装文档](https://docs.jumpserver.org/zh/v4/installation/setup_linux_standalone/online_install/)

### 默认账号信息

| 项目       | 值                                                         |
| :--------- | :--------------------------------------------------------- |
| 默认账号   | admin                                                      |
| 默认密码   | admin                                                      |
| 修改后密码 | password                                                   |
| 管理员邮箱 | [xxx@xx.com]                                               |
| 用户邮箱   | [xxx@xx.com]                                               |

> 注意：主机绑定的管理用户密码为主机的 root 密码。



## Koko 组件安装

bash

```bash
wget -O /root/koko-v2.28.8.tar.gz https://github.com/jumpserver/koko/archive/refs/tags/v2.28.8.tar.gz
tar -xf koko-v2.28.8.tar.gz -C /root/koko-v2.28.8 --strip-components 1
```



------

## JumpServer 服务管理

| 操作 | 命令                |
| :--- | :------------------ |
| 启动 | `./jmsctl.sh start` |
| 停止 | `./jmsctl.sh down`  |

------

## 防火墙规则

仅允许 JumpServer 跳板机（IP: `192.168.x.x`）通过 SSH 登录：

bash

```bash
iptables -A INPUT -s 192.168.x.x -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j REJECT
```



------
## 注意事项
> 文档最后更新日期：2025年（根据实际时间调整）
> 适用于 JumpServer v2 版本，Koko v2.28.8