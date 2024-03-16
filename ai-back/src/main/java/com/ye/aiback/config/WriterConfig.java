package com.ye.aiback.config;


import com.alibaba.fastjson.JSON;
import com.ye.aiback.domain.WriterConfigEntity;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

@Component
@Data
public class WriterConfig {
    public static WriterConfigEntity writerConfigEntity;
    public WriterConfig(){
        // 获取InputStream
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("config.json")) {
            if (inputStream != null) {
                // 转换InputStream为Reader
                InputStreamReader inputStreamReader = new InputStreamReader(inputStream);
                // 包装Reader为BufferedReader，提供readLine方法
                BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

                String line;
                StringBuilder result = new StringBuilder();
                // 逐行读取文本
                while ((line = bufferedReader.readLine()) != null) {
                    System.out.println(line);
                    result.append(line);
                }
                writerConfigEntity = JSON.parseObject(result.toString(), WriterConfigEntity.class);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
