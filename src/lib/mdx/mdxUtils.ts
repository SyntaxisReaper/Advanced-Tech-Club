import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export function getMdxFiles(dir: string) {
    const dirPath = path.join(contentDirectory, dir);
    if (!fs.existsSync(dirPath)) {
        return [];
    }
    return fs.readdirSync(dirPath).filter((file) => path.extname(file) === ".mdx" || path.extname(file) === ".md");
}

export function readMdxFile(dir: string, filename: string) {
    const filePath = path.join(contentDirectory, dir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return matter(fileContent);
}

export function getAllMdxContent(dir: string) {
    const files = getMdxFiles(dir);
    return files.map((file) => {
        const { data, content } = readMdxFile(dir, file);
        const slug = file.replace(/\.mdx?$/, "");
        return {
            metadata: data,
            slug,
            content,
        };
    });
}
