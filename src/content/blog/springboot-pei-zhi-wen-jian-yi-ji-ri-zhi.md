---
title: "SpringBoot-配置文件以及日志"
description: "现在有多个配置文件，运行时要读取其中一个配置文件，怎么选择？"
pubDate: "2022-10-14 17:07:00"
categories: ["后端"]
tags: ["java","SpringBoot","配置文件","日志"]
draft: false
---
## 一、多个配置文件的读取

现在有多个配置文件，运行时要读取其中一个配置文件，怎么选择？

![](https://bigotry-zb.github.io/2022/10/14/springboot-pei-zhi-wen-jian-yi-ji-ri-zhi/image-20221014172131119.png)

多个配置文件的读取，在设置好property类后，可以在application中选择要读取的对象，如下：

```yml
server:
  port: 8080
  servlet:
    context-path: /demo
spring:
  profiles:
    active: dev
```

当要读取 application-dev 时，只需将第七行代码改为dev，当要读取application-prod时，只需将第七行代码改为prod。

如下是设置为dev的运行结果：

![](https://bigotry-zb.github.io/2022/10/14/springboot-pei-zhi-wen-jian-yi-ji-ri-zhi/image-20221014172456012.png)

## 二、spring-boot 集成 spring-boot-starter-actuator

actuator用于监控 spring-boot 的启动和运行状态

### 1、pom文件

```xml
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
<groupId>org.springframework.security</groupId>
<artifactId>spring-security-test</artifactId>
<scope>test</scope>
</dependency>
```

### 2、application.yml

```yml
server:
  port: 8080
  servlet:
    context-path: /demo
# 若要访问端点信息，需要配置用户名和密码
spring:
  security:
    user:
      name: zhaibiao
      password: 123456
      
management:
  # 端点信息接口使用的端口，为了和主系统接口使用的端口进行分离
  server:
    port: 8090
    servlet:
      context-path: /sys
  # 端点健康情况，默认值"never"，设置为"always"可以显示硬盘使用情况和线程情况
  endpoint:
    health:
      show-details: always
  # 设置端点暴露的哪些内容，默认["health","info"]，设置"*"代表暴露所有可访问的端点
  endpoints:
    web:
      exposure:
        include: '*'
```

### 3、端点暴露地址

1.  打开浏览器，访问：[http://localhost:8090/sys/actuator/mappings](http://localhost:8090/sys/actuator/mappings) ，输入用户名(zhaibiao)密码(123456)即可看到所有的mapping信息
2.  访问：[http://localhost:8090/sys/actuator/beans](http://localhost:8090/sys/actuator/beans) ，输入用户名(zhaibiao)密码(123456)即可看到所有 Spring 管理的Bean

-   actuator文档：[https://docs.spring.io/spring-boot/docs/2.0.5.RELEASE/reference/htmlsingle/#production-ready](https://docs.spring.io/spring-boot/docs/2.0.5.RELEASE/reference/htmlsingle/#production-ready)

### 4、结果

![beans](https://bigotry-zb.github.io/2022/10/14/springboot-pei-zhi-wen-jian-yi-ji-ri-zhi/image-20221017161554284.png)

![mappings](https://bigotry-zb.github.io/2022/10/14/springboot-pei-zhi-wen-jian-yi-ji-ri-zhi/image-20221017161608902.png)

## 三、spring-boot集成admin

### 1、服务端

#### 1、导入依赖

```xml
<dependency>
  <groupId>de.codecentric</groupId>
  <artifactId>spring-boot-admin-starter-server</artifactId>
</dependency>
```

#### 2、配置文件

服务端配置文件不需要太多配置，端口号即可

```yml
server:
  port: 8000
```

#### 3、主启动类

必须要在主启动类上加 `@EnableAdminServer` 注解

```java
@EnableAdminServer
@SpringBootApplication
public class SpringBootDemoAdminServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootDemoAdminServerApplication.class, args);
    }
}
```

### 2、客户端

#### 1、导入依赖

```xml
<dependency>
  <groupId>de.codecentric</groupId>
  <artifactId>spring-boot-admin-starter-client</artifactId>
</dependency>

<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

#### 2、配置文件

```yml
server:
  port: 8080
  servlet:
    context-path: /demo
spring:
  application:
    # Spring Boot Admin展示的客户端项目名，不设置，会使用自动生成的随机id
    name: spring-boot-demo-admin-client
  boot:
    admin:
      client:
        # Spring Boot Admin 服务端地址
        url: "http://localhost:8000/"
        instance:
          metadata:
            # 客户端端点信息的安全认证信息
            user.name: ${spring.security.user.name}
            user.password: ${spring.security.user.password}
  security:
    user:
      name: zhaibiao
      password: 123456
management:
  endpoint:
    health:
      # 端点健康情况，默认值"never"，设置为"always"可以显示硬盘使用情况和线程情况
      show-details: always
  endpoints:
    web:
      exposure:
        # 设置端点暴露的哪些内容，默认["health","info"]，设置"*"代表暴露所有可访问的端点
        include: "*"
```

#### 3、控制类（用来测试）

```java
@RestController
public class IndexController {
    @GetMapping(value = {"", "/"})
    public String index() {
        return "This is a Spring Boot Admin Client.";
    }
}
```

### 3、结果

运行步骤：

1.  先启动server服务端，启动管控台服务端程序
2.  再启动client客户端，注册到服务端
3.  观察服务端里，客户端程序的运行状态等信息

![server](https://bigotry-zb.github.io/2022/10/14/springboot-pei-zhi-wen-jian-yi-ji-ri-zhi/image-20221017163939849.png)

![client](https://bigotry-zb.github.io/2022/10/14/springboot-pei-zhi-wen-jian-yi-ji-ri-zhi/image-20221017164045955.png)

## 四、spring-boot集成logback

演示如何使用 logback 记录程序运行过程中的日志，以及如何配置 logback，可以同时生成控制台日志和文件日志记录，文件日志以日期和大小进行拆分生成。

### 1、导入依赖

```xml
<dependencies>
 <dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
 </dependency>

 <dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
 </dependency>

 <dependency>
  <groupId>org.projectlombok</groupId>
  <artifactId>lombok</artifactId>
  <optional>true</optional>
 </dependency>
</dependencies>

   <build>
       <finalName>demo-logback</finalName>
       <plugins>
           <plugin>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-maven-plugin</artifactId>
           </plugin>
       </plugins>
   </build>
```

### 2、配置文件

```yml
server:
  port: 8080
  servlet:
    context-path: /demo
```

配置端口

### 3、logback-spring.xml

在resources下建立logback-spring.xml用于配置logback

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <property name="FILE_ERROR_PATTERN"
            value="${FILE_LOG_PATTERN:-%d{${LOG_DATEFORMAT_PATTERN:-yyyy-MM-dd HH:mm:ss.SSS}} ${LOG_LEVEL_PATTERN:-%5p} ${PID:- } --- [%t] %-40.40logger{39} %file:%line: %m%n${LOG_EXCEPTION_CONVERSION_WORD:-%wEx}}"/>
  <include resource="org/springframework/boot/logging/logback/defaults.xml"/>
 <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
  <filter class="ch.qos.logback.classic.filter.LevelFilter">
   <level>INFO</level>
  </filter>
  <encoder>
   <pattern>${CONSOLE_LOG_PATTERN}</pattern>
   <charset>UTF-8</charset>
  </encoder>
 </appender>

 <appender name="FILE_INFO" class="ch.qos.logback.core.rolling.RollingFileAppender">
  <!--如果只是想要 Info 级别的日志，只是过滤 info 还是会输出 Error 日志，因为 Error 的级别高， 所以我们使用下面的策略，可以避免输出 Error 的日志-->
  <filter class="ch.qos.logback.classic.filter.LevelFilter">
   <!--过滤 Error-->
   <level>ERROR</level>
   <!--匹配到就禁止-->
   <onMatch>DENY</onMatch>
   <!--没有匹配到就允许-->
   <onMismatch>ACCEPT</onMismatch>
  </filter>
  <!--日志名称，如果没有File 属性，那么只会使用FileNamePattern的文件路径规则如果同时有<File>和<FileNamePattern>，那么当天日志是<File>，明天会自动把今天的日志改名为今天的日期。即，<File> 的日志都是当天的。-->
  <!--<File>logs/info.demo-logback.log</File>-->
  <!--滚动策略，按照时间滚动 TimeBasedRollingPolicy-->
  <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
   <!--文件路径,定义了日志的切分方式——把每一天的日志归档到一个文件中,以防止日志填满整个磁盘空间-->
   <FileNamePattern>logs/demo-logback/info.created_on_%d{yyyy-MM-dd}.part_%i.log</FileNamePattern>
   <!--只保留最近90天的日志-->
   <maxHistory>90</maxHistory>
   <!--用来指定日志文件的上限大小，那么到了这个值，就会删除旧的日志-->
   <!--<totalSizeCap>1GB</totalSizeCap>-->
   <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
    <!-- maxFileSize:这是活动文件的大小，默认值是10MB,本篇设置为1KB，只是为了演示 -->
    <maxFileSize>2MB</maxFileSize>
   </timeBasedFileNamingAndTriggeringPolicy>
  </rollingPolicy>
  <!--<triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">-->
  <!--<maxFileSize>1KB</maxFileSize>-->
  <!--</triggeringPolicy>-->
  <encoder>
   <pattern>${FILE_LOG_PATTERN}</pattern>
   <charset>UTF-8</charset> <!-- 此处设置字符集 -->
  </encoder>
 </appender>

 <appender name="FILE_ERROR" class="ch.qos.logback.core.rolling.RollingFileAppender">
  <!--如果只是想要 Error 级别的日志，那么需要过滤一下，默认是 info 级别的，ThresholdFilter-->
  <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
   <level>Error</level>
  </filter>
  <!--日志名称，如果没有File 属性，那么只会使用FileNamePattern的文件路径规则如果同时有<File>和<FileNamePattern>，那么当天日志是<File>，明天会自动把今天的日志改名为今天的日期。即，<File> 的日志都是当天的。-->
  <!--<File>logs/error.demo-logback.log</File>-->
  <!--滚动策略，按照时间滚动 TimeBasedRollingPolicy-->
  <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
   <!--文件路径,定义了日志的切分方式——把每一天的日志归档到一个文件中,以防止日志填满整个磁盘空间-->
   <FileNamePattern>logs/demo-logback/error.created_on_%d{yyyy-MM-dd}.part_%i.log</FileNamePattern>
   <!--只保留最近90天的日志-->
   <maxHistory>90</maxHistory>
   <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
    <!-- maxFileSize:这是活动文件的大小，默认值是10MB,本篇设置为1KB，只是为了演示 -->
    <maxFileSize>2MB</maxFileSize>
   </timeBasedFileNamingAndTriggeringPolicy>
  </rollingPolicy>
  <encoder>
   <pattern>${FILE_ERROR_PATTERN}</pattern>
   <charset>UTF-8</charset> <!-- 此处设置字符集 -->
  </encoder>
 </appender>

 <root level="info">
  <appender-ref ref="CONSOLE"/>
  <appender-ref ref="FILE_INFO"/>
  <appender-ref ref="FILE_ERROR"/>
 </root>
</configuration>
```

### 4、主启动类进行测试

```java
@SpringBootApplication
@Slf4j
public class SpringBootDemoLogbackApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(SpringBootDemoLogbackApplication.class, args);
        int length = context.getBeanDefinitionNames().length;
        log.trace("Spring boot启动初始化了 {} 个 Bean", length);
        log.debug("Spring boot启动初始化了 {} 个 Bean", length);
        log.info("Spring boot启动初始化了 {} 个 Bean", length);
        log.warn("Spring boot启动初始化了 {} 个 Bean", length);
        log.error("Spring boot启动初始化了 {} 个 Bean", length);
        try {
            int i = 0;
            //int j = 1 / i;
        } catch (Exception e) {
            log.error("【SpringBootDemoLogbackApplication】启动异常：", e);
        }
    }
}
```

### 5、结果

报错日志如下：

![Error](https://bigotry-zb.github.io/2022/10/14/springboot-pei-zhi-wen-jian-yi-ji-ri-zhi/image-20221017170557025.png)

> TODO

## 五、spring-boot 使用 AOP 切面的方式记录 web 请求日志

## 六、spring-boot 统一异常处理
