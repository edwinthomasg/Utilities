const { readFile, readdir, writeFile } = require("fs").promises
const frontMatter = require("gray-matter")
const os = require("os")
const path = require("path")
const axios = require("axios")
const { createContent, updateContent } = require("./helpers/fileTask")

const templatesPath = "/Desktop/hugo-project/templates"
const contentPath = "/Desktop/hugo-project/content"
const dataSource = path.join(os.homedir(), templatesPath )
const contentSource = path.join(os.homedir(), contentPath )

//Update the front matter,body and write it to hugo content
const updateMarkdownFile = async(dataSource, file) => {
        const data = await readFile(path.join(dataSource, file), {encoding: "utf-8"})
        let { content, data: matter } = frontMatter(data)
        let updatedContent = updateContent(content, matter)
      
        await writeFile(path.join(dataSource, file), updatedContent)
        .then(() => console.log(`${file} updated successfully`))
        .catch(() => console.log("error in updating the file"))

        await writeFile(path.join(contentSource, file), updatedContent)
        .then(() => console.log(`${file} created successfully to content folder`))
        .catch(() => console.log("error in writing the file to content folder"))
}

//Read all markdown files from hugo templates
const markdownFiles = async() => {
    const data = await readdir(dataSource, {withFileTypes: true})
    let files = data.map(file => file.isFile() && file.name.endsWith(".md") && file.name)
    await Promise.all(files.map(file => updateMarkdownFile(dataSource, file)))
}

markdownFiles()

//Create a new markdown file from json api and write it to hugo content
const generateDynamicFile = async() => {
    const response = await axios.get("http://localhost:4000/markdown-data")
    const { body, frontmatter } = response.data
    let file = frontmatter.title.split(" ").join("-")+".md"
    const markdownContent = createContent(body, frontmatter)
    await writeFile(path.join(dataSource, file), markdownContent)
    .then(() => {
      console.log(`${file} created successfully to template folder`)
    })
    .catch(() => {
        console.log("error in creating the file")
    })
    await writeFile(path.join(contentSource, file), markdownContent)
    .then(() => {
      console.log(`${file} created successfully to content folder`)
    })
    .catch(() => {
        console.log("error in creating the file")
    })
}

generateDynamicFile()




