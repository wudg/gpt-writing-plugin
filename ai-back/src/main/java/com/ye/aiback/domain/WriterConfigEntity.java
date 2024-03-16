package com.ye.aiback.domain;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Data
public class WriterConfigEntity {
    private List<WriterRule> rules;

    @Data
    public static final class WriterRule{
        /**
         * 爆文方向（如情感类、军事类、娱乐类）
         */
        private String ruleName;

        /**
         * 爆文方向简介
         */
        private String intro;

        /**
         * 导出哪些步数的内容到word
         */
        private List<Integer> txtOutput;

        /**
         * 交互流程
         */
        private List<WriterProcesses> processes;

    }

    @Data
    public static final class WriterProcesses{

        /**
         * 与GPT的交互类型（1-使用txt的文案，2-使用对应步骤gpt返回的文案，3-使用爆文的标题，4-使用爆文的正文）
         */
        private Integer operateType;

        /**
         * 与GPT的交互文案的内容（支持表达式，如${3}表示第三步GPT返回的内容）
         */
        private String express;
    }
}
