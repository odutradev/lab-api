import spaceModel from "../../models/space.js";
import taskModel from "../../models/task.js";

export default class Service {

    async createTask({ parent, description, content, deadline, order, priority, scheduling, status }, { userID, spaceID }){
        try {
            const space = await spaceModel.findById(spaceID);
			if (!space) return { error: "space_not_found" };

            space.tasksCounter += 1;
            await space.save();

            const extra = {
                lastUpdate: Date.now(),
            };
        
            if (status == "active"){
                extra.startIn = Date.now();
            };

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
                status,
                order,
                ...extra,
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

    async deleteTask({}, {}, { taskID }){
        try {
            var [ parent, child ] = await Promise.all([
                taskModel.findById(taskID),
                taskModel.find({ parent: taskID })
            ]);
            if (!parent) return { error: "task_not_found" };

            await taskModel.findByIdAndDelete(taskID);

            for (const childTask of child) {
                await taskModel.findByIdAndDelete(childTask._id);
            }

            return { success: true };
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async updateTask({ data }, {}, { taskID }){
        try {
            const task = await taskModel.findById(taskID);
            if (!task) return { error: "task_not_found" };

            delete data._id;

            const extra = {
                lastUpdate: Date.now(),
            };

            if (data?.status == "active" && !task.startIn) extra.startIn = Date.now();
            if (data?.status == "completed" && !task.endIn) extra.endIn = Date.now();

            return await taskModel.findByIdAndUpdate(taskID, { $set:{ ...data, ...extra } }, { new: true });
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async updateAllTasks({ data }, {}) {
        try {    
            return await Promise.all(data.map(async (task) => {
                const extra = {
                    lastUpdate: Date.now(),
                };

                if (task?.status == "active" && !task.startIn) extra.startIn = Date.now();
                if (task?.status == "completed" && !task.endIn) extra.endIn = Date.now();

                const updatedData = { ...task, ...extra };
                return await taskModel.findByIdAndUpdate(task._id, { $set: updatedData }, { new: true });
            }));
        } catch (err) {
            return { error: "internal_error" };
        }
    }
    
}