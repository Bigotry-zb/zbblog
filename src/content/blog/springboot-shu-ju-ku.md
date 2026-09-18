---
title: "SpringBoot-数据库"
description: "整体结构："
pubDate: "2022-10-17 17:12:00"
categories: ["后端"]
tags: ["java","SpringBoot","数据库"]
draft: false
---
## 一、spring-boot 集成 Jdbc Template

整体结构：

![整体结构](/images/hexo/2022/10/17/springboot-shu-ju-ku/image-20221017184658161.png)

### 1、导入依赖

```xml
<dependency>
         <groupId>mysql</groupId>
         <artifactId>mysql-connector-java</artifactId>
      </dependency>

      <dependency>
         <groupId>cn.hutool</groupId>
         <artifactId>hutool-all</artifactId>
      </dependency>

      <dependency>
         <groupId>org.projectlombok</groupId>
         <artifactId>lombok</artifactId>
         <optional>true</optional>
      </dependency>
```

### 2、application.yml

```yml
server:
  port: 8080
  servlet:
    context-path: /demo
spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/spring-boot-demo?useUnicode=true&characterEncoding=UTF-8&useSSL=false&autoReconnect=true&failOverReadOnly=false&serverTimezone=GMT%2B8
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.zaxxer.hikari.HikariDataSource
    initialization-mode: always
    continue-on-error: true
    schema:
    - "classpath:db/schema.sql"
    data:
    - "classpath:db/data.sql"
    hikari:
      minimum-idle: 5
      connection-test-query: SELECT 1 FROM DUAL
      maximum-pool-size: 20
      auto-commit: true
      idle-timeout: 30000
      pool-name: SpringBootDemoHikariCP
      max-lifetime: 60000
      connection-timeout: 30000
logging:
  level:
    com.xkcoding: debug
```

### 3、实体类User

```java
@Data
@Table(name = "orm_user")
public class User implements Serializable {
    /**
     * 主键
     */
    @Pk
    private Long id;

    /**
     * 用户名
     */
    private String name;

    /**
     * 加密后的密码
     */
    private String password;

    /**
     * 加密使用的盐
     */
    private String salt;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 手机号码
     */
    @Column(name = "phone_number")
    private String phoneNumber;

    /**
     * 状态，-1：逻辑删除，0：禁用，1：启用
     */
    private Integer status;

    /**
     * 创建时间
     */
    @Column(name = "create_time")
    private Date createTime;

    /**
     * 上次登录时间
     */
    @Column(name = "last_login_time")
    private Date lastLoginTime;

    /**
     * 上次更新时间
     */
    @Column(name = "last_update_time")
    private Date lastUpdateTime;
}
```

### 4、UserDao继承BaseDao

```java
@Repository
public class UserDao extends BaseDao<User, Long> {

    @Autowired
    public UserDao(JdbcTemplate jdbcTemplate) {
        super(jdbcTemplate);
    }

    /**
     * 保存用户
     *
     * @param user 用户对象
     * @return 操作影响行数
     */
    public Integer insert(User user) {
        return super.insert(user, true);
    }

    /**
     * 根据主键删除用户
     *
     * @param id 主键id
     * @return 操作影响行数
     */
    public Integer delete(Long id) {
        return super.deleteById(id);
    }

    /**
     * 更新用户
     *
     * @param user 用户对象
     * @param id   主键id
     * @return 操作影响行数
     */
    public Integer update(User user, Long id) {
        return super.updateById(user, id, true);
    }

    /**
     * 根据主键获取用户
     *
     * @param id 主键id
     * @return id对应的用户
     */
    public User selectById(Long id) {
        return super.findOneById(id);
    }

    /**
     * 根据查询条件获取用户列表
     *
     * @param user 用户查询条件
     * @return 用户列表
     */
    public List<User> selectUserList(User user) {
        return super.findByExample(user);
    }
}
```

### 5、UserServiceImpl实现IUserService接口

```java
@Service
public class UserServiceImpl implements IUserService {
    private final UserDao userDao;

    @Autowired
    public UserServiceImpl(UserDao userDao) {
        this.userDao = userDao;
    }

    /**
     * 保存用户
     *
     * @param user 用户实体
     * @return 保存成功 {@code true} 保存失败 {@code false}
     */
    @Override
    public Boolean save(User user) {
        String rawPass = user.getPassword();
        String salt = IdUtil.simpleUUID();
        String pass = SecureUtil.md5(rawPass + Const.SALT_PREFIX + salt);
        user.setPassword(pass);
        user.setSalt(salt);
        return userDao.insert(user) > 0;
    }

    /**
     * 删除用户
     *
     * @param id 主键id
     * @return 删除成功 {@code true} 删除失败 {@code false}
     */
    @Override
    public Boolean delete(Long id) {
        return userDao.delete(id) > 0;
    }

    /**
     * 更新用户
     *
     * @param user 用户实体
     * @param id   主键id
     * @return 更新成功 {@code true} 更新失败 {@code false}
     */
    @Override
    public Boolean update(User user, Long id) {
        User exist = getUser(id);
        if (StrUtil.isNotBlank(user.getPassword())) {
            String rawPass = user.getPassword();
            String salt = IdUtil.simpleUUID();
            String pass = SecureUtil.md5(rawPass + Const.SALT_PREFIX + salt);
            user.setPassword(pass);
            user.setSalt(salt);
        }
        BeanUtil.copyProperties(user, exist, CopyOptions.create().setIgnoreNullValue(true));
        exist.setLastUpdateTime(new DateTime());
        return userDao.update(exist, id) > 0;
    }

    /**
     * 获取单个用户
     *
     * @param id 主键id
     * @return 单个用户对象
     */
    @Override
    public User getUser(Long id) {
        return userDao.findOneById(id);
    }

    /**
     * 获取用户列表
     *
     * @param user 用户实体
     * @return 用户列表
     */
    @Override
    public List<User> getUser(User user) {
        return userDao.findByExample(user);
    }
}
```

### 6、结果

![](/images/hexo/2022/10/17/springboot-shu-ju-ku/image-20221017184607196.png)

## 二、spring-boot 集成原生mybatis

spring-boot 集成原生mybatis，使用 [mybatis-spring-boot-starter](https://github.com/mybatis/spring-boot-starter) 集成

### 1、导入依赖

```xml
<dependency>
          <groupId>org.mybatis.spring.boot</groupId>
          <artifactId>mybatis-spring-boot-starter</artifactId>
          <version>${mybatis.version}</version>
      </dependency>

      <dependency>
          <groupId>mysql</groupId>
          <artifactId>mysql-connector-java</artifactId>
      </dependency>
```

### 2、主启动类

```java
@MapperScan(basePackages = {"com.xkcoding.orm.mybatis.mapper"})
@SpringBootApplication
public class SpringBootDemoOrmMybatisApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootDemoOrmMybatisApplication.class, args);
    }
}
```

记得加 @MapperScan 注解

### 3、application.yml

```yml
spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/spring-boot-demo?useUnicode=true&characterEncoding=UTF-8&useSSL=false&autoReconnect=true&failOverReadOnly=false&serverTimezone=GMT%2B8
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.zaxxer.hikari.HikariDataSource
    initialization-mode: always
    continue-on-error: true
    schema:
    - "classpath:db/schema.sql"
    data:
    - "classpath:db/data.sql"
    hikari:
      minimum-idle: 5
      connection-test-query: SELECT 1 FROM DUAL
      maximum-pool-size: 20
      auto-commit: true
      idle-timeout: 30000
      pool-name: SpringBootDemoHikariCP
      max-lifetime: 60000
      connection-timeout: 30000
logging:
  level:
    com.xkcoding: debug
    com.xkcoding.orm.mybatis.mapper: trace
mybatis:
  configuration:
    # 下划线转驼峰
    map-underscore-to-camel-case: true
  mapper-locations: classpath:mappers/*.xml
  type-aliases-package: com.xkcoding.orm.mybatis.entity
```

### 4、UserMapper接口

```java
@Mapper
@Component
public interface UserMapper {

    /**
     * 查询所有用户
     *
     * @return 用户列表
     */
    @Select("SELECT * FROM orm_user")
    List<User> selectAllUser();

    /**
     * 根据id查询用户
     *
     * @param id 主键id
     * @return 当前id的用户，不存在则是 {@code null}
     */
    @Select("SELECT * FROM orm_user WHERE id = #{id}")
    User selectUserById(@Param("id") Long id);

    /**
     * 保存用户
     *
     * @param user 用户
     * @return 成功 - {@code 1} 失败 - {@code 0}
     */
    int saveUser(@Param("user") User user);

    /**
     * 删除用户
     *
     * @param id 主键id
     * @return 成功 - {@code 1} 失败 - {@code 0}
     */
    int deleteById(@Param("id") Long id);

}
```

### 5、UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.xkcoding.orm.mybatis.mapper.UserMapper">

    <insert id="saveUser">
        INSERT INTO `orm_user` (`name`,
                                `password`,
                                `salt`,
                                `email`,
                                `phone_number`,
                                `status`,
                                `create_time`,
                                `last_login_time`,
                                `last_update_time`)
        VALUES (#{user.name},
                #{user.password},
                #{user.salt},
                #{user.email},
                #{user.phoneNumber},
                #{user.status},
                #{user.createTime},
                #{user.lastLoginTime},
                #{user.lastUpdateTime})
    </insert>

    <delete id="deleteById">
        DELETE
        FROM `orm_user`
        WHERE `id` = #{id}
    </delete>
</mapper>
```

### 6、测试

```java
@Slf4j
public class UserMapperTest extends SpringBootDemoOrmMybatisApplicationTests {
    @Autowired
    private UserMapper userMapper;

    @Test
    public void selectAllUser() {
        List<User> userList = userMapper.selectAllUser();
        Assert.assertTrue(CollUtil.isNotEmpty(userList));
        log.debug("【userList】= {}", userList);
    }

    @Test
    public void selectUserById() {
        User user = userMapper.selectUserById(1L);
        Assert.assertNotNull(user);
        log.debug("【user】= {}", user);
    }

    @Test
    public void saveUser() {
        String salt = IdUtil.fastSimpleUUID();
        User user = User.builder().name("testSave3").password(SecureUtil.md5("123456" + salt)).salt(salt).email("testSave3@xkcoding.com").phoneNumber("17300000003").status(1).lastLoginTime(new DateTime()).createTime(new DateTime()).lastUpdateTime(new DateTime()).build();
        int i = userMapper.saveUser(user);
        Assert.assertEquals(1, i);
    }

    @Test
    public void deleteById() {
        int i = userMapper.deleteById(1L);
        Assert.assertEquals(1, i);
    }
}
```

### 7、参考

-   Mybatis官方文档：[http://www.mybatis.org/mybatis-3/zh/index.html](http://www.mybatis.org/mybatis-3/zh/index.html)
-   Mybatis官方脚手架文档：[http://www.mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/](http://www.mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/)
-   Mybatis整合Spring Boot官方demo：[https://github.com/mybatis/spring-boot-starter/tree/master/mybatis-spring-boot-samples](https://github.com/mybatis/spring-boot-starter/tree/master/mybatis-spring-boot-samples)
