const {stringify} = require("yaml")

const updateContent = (content, matter) => {
    const date = new Date()
    content = matter.editedAt ? content.replace(content.match(/(?<=This markdown content is edited lastly at timestamp )[0-9]*/),date.getTime()) :
              content+"\n"+`This markdown content is edited lastly at timestamp ${date.getTime()}`
    matter.editedAt ? (matter.editedAt = date) : Object.assign(matter, { editedAt: date })
    return `---\n${stringify(matter)}---\n${content}`
}

const createContent = (content, matter) => {
    let date = new Date()
    Object.assign(matter, { createdAt: date })
    const createdContent = `This body is edited.This markdown content is created at timestamp ${date.getTime()}`
    content = content+"\n"+createdContent
    return `---\n${stringify(matter)}---\n${content}`
}

module.exports = {
    updateContent,
    createContent
}