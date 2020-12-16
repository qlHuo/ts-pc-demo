// 在ts中不能直接引用js
// 我们可以使用 .d.ts 作为翻译文件 从而ts 可以使用js中的包
import superagent from 'superagent';
import fs from 'fs';
import path from 'path';
import DellAnalyzer from './dellAnalyzer';

export interface Analyzer {
  analyze: (html: string, filePath: string) => string;
}

class Crowller {
  private filePath = path.resolve(__dirname, '../data/course.json');
  // 获取页面上的html
  private async getRawHtml() {
    let res = await superagent.get(this.url);
    return res.text;
  }

  // 写入course.json
  private writeFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }

  // 初始化爬取过程的方法
  private async initSpiderProcess() {
    const html = await this.getRawHtml();
    // 具体的分析流程，写到另一个文件中
    const fileContent = this.analyzer.analyze(html, this.filePath);
    this.writeFile(fileContent);
  }

  constructor(private url: string, private analyzer: Analyzer) {
    // 实例化之后就开始调用 爬取过程的方法
    this.initSpiderProcess();
  }
}

const secret = 'x3b174jsx';
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;

// const analyzer = new DellAnalyzer();
const analyzer = DellAnalyzer.getInstance();
// const analyzer1 = DellAnalyzer.getInstance();
// console.log(analyzer === analyzer1); // true

new Crowller(url, analyzer);
