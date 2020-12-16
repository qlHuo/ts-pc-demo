import cheerio from 'cheerio';
import fs from 'fs';
import { Analyzer } from './crowller';

interface Course {
  title: string;
  count: number;
}

interface CourseRes {
  time: number;
  data: Course[];
}

// 最终存储到 course.json 文件中的数据结构
interface Content {
  [propName: number]: Course[];
}

class DellAnalyzer implements Analyzer {
  // 单例模式：只允许实例化一个对象
  private static instance: DellAnalyzer;
  static getInstance() {
    if (!DellAnalyzer.instance) {
      DellAnalyzer.instance = new DellAnalyzer();
    }
    return DellAnalyzer.instance;
  }

  // 获取课程具体信息
  private getCourseInfo(html: string) {
    const $ = cheerio.load(html);
    const courseItem = $('.course-item');
    let courseInfos: Course[] = [];

    courseItem.map((index, element) => {
      const descs = $(element).find('.course-desc');
      const title = descs.eq(0).text();
      const count = parseInt(descs.eq(1).text().split('：')[1]);
      courseInfos.push({
        title,
        count,
      });
    });
    return {
      time: new Date().getTime(),
      data: courseInfos,
    };
  }

  // 生成course.json
  private generateJsonContent(courseInfo: CourseRes, filePath: string) {
    let fileContent: Content = {};
    // 判断data文件夹中是否存在course.json 文件
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    fileContent[courseInfo.time] = courseInfo.data;
    return fileContent;
  }

  public analyze(html: string, filePath: string) {
    const courseInfo = this.getCourseInfo(html);
    const fileContent = this.generateJsonContent(courseInfo, filePath);
    return JSON.stringify(fileContent);
  }

  private constructor() {}
}

export default DellAnalyzer;
