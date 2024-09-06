import spaceModel from "../../models/space.js";
import taskModel from "../../models/task.js";
import userModel from "../../models/user.js";

export default class Service {

    async createTask({ parent, description, content, deadline, index, priority, scheduling }, { userID, spaceID }){
        try {
            const space = await spaceModel.findById(spaceID);
			if (!space) return { error: "space_not_found" };

            space.tasksCounter += 1;
            await space.save();

            const task = new taskModel({
                identificator: space.tasksCounter,
                creator: userID,
                space: spaceID,
                description,
                scheduling,
                priority,
                deadline,
                content,
                parent,
                index,
            });

            await task.save();
            return task
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async getTasks({}, { spaceID }){
        try {
            var allTasks = await taskModel.find({ space: spaceID });

            var parentTasks = allTasks.filter(task => !task.parent);
            
            var taskMap = {};
            parentTasks.forEach(task => {
              taskMap[String(task._id)] = { ...task._doc, subs: [] };
            });
            
            allTasks.filter(task => task.parent).forEach(task => {
              const parentId = String(task.parent);
              if (taskMap[parentId]) {
                taskMap[parentId].subs.push(task);
              }
            });
            
            return Object.values(taskMap);
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async getTaskById({}, {}, { taskID }){
        try {
            var [ parent, child ] = await Promise.all([
                taskModel.findById(taskID),
                taskModel.find({ parent: taskID })
            ]);
            if (!parent) return { error: "task_not_found" };

            return { ...parent._doc, subs: child };
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }
    
}