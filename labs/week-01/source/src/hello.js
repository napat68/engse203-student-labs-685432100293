const student = {
  name: "นภัสประภา กุลสุทธิเสถียร",
  studentId: "685432100293",
  os: process.platform,
  node: process.version,
};

function createGreeting({ name, studentId, os, node }) {
  return `Hello ${name} (${studentId}) | OS: ${os} | Node: ${node}`;
}

console.log(createGreeting(student));