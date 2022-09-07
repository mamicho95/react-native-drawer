import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "task.db";
const orden = [
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
  "Domingo",
];

export function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }
  const db = SQLite.openDatabase(DATABASE_NAME);
  return db;
}
export function createTables(db) {
  const query = `CREATE TABLE IF NOT EXISTS tasks(
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    title VARCHAR(255) NOT NULL,
    day varchar(9) NOT NULL,
    hour varchar(30) NOT NULL,
    notification INTEGER NOT NULL)`;
  db.transaction((tx) => {
    tx.executeSql(query);
  });
  const query2 = `CREATE TABLE IF NOT EXISTS tasks_done
    (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      date_time date NOT NULL,
      task_id INTEGER NOT NULL,
      FOREIGN KEY(task_id) REFERENCES tasks(id)
    )`;
  db.transaction((tx) => {
    tx.executeSql(query);
  });
  db.transaction((tx) => {
    tx.executeSql(query2);
  });
}
export const insertTask = (db, taskForm) => {
  const { title, day, hour } = taskForm;
  const notification = taskForm.notification ? 1 : 0;
  const insertQuery = `INSERT INTO tasks (title, day, hour, notification) values (?, ?, ?, ?)`;
  return new Promise(
    async (resolve, reject) =>
      await db.transaction(async (tx) => {
        await tx.executeSql(
          insertQuery,
          [title, day, hour.toTimeString().split(" ")[0], notification],
          () => {
            tx.executeSql(
              "select * from tasks",
              [],
              (_, { rows }) => {
                resolve(rows._array.pop());
              },
              (_, err) => {
                reject(err);
                console.log(`err: ${err}`);
              }
            );
          },
          (_, err) => {
            console.log(`err: ${err}`);
          }
        );
      })
  );
};
export const updateTaskDB = (db, taskForm) => {
  const { title, day, hour, id } = taskForm;
  const notification = taskForm.notification ? 1 : 0;
  const updatetQuery = `UPDATE tasks SET title = ?, day=?, hour=?, notification=? where id = ?`;
  return new Promise(
    async (resolve, reject) =>
      await db.transaction(async (tx) => {
        await tx.executeSql(
          updatetQuery,
          [title, day, hour, notification, id],
          () => {
            tx.executeSql(
              "select * from tasks",
              [],
              (_, { rows }) => {
                resolve(rows._array.pop());
              },
              (_, err) => {
                reject(err);
                console.log(`err: ${err}`);
              }
            );
          },
          (_, err) => {
            console.log(`err: ${err}`);
          }
        );
      })
  );
};
export function deleteTaskDone(db, taskId) {
  const insertQuery = `delete from tasks_done where task_id=?`;
  db.transaction((tx) => {
    tx.executeSql(insertQuery, [taskId]);
  });
}
export function deleteTaskDB(db, taskId) {
  const deleteQuery = `DELETE from tasks where id=?`;
  db.transaction((tx) => {
    tx.executeSql(deleteQuery, [taskId]);
  });
}
export const getTaskOfDay = (db) => {
  return new Promise((resolve, reject) => {
    const query = `select t.*, (select count(*) from tasks_done where id=t.id and strftime('%Y-%W',date_time)=strftime('%Y-%W','now')) as completed from tasks as t where t.day = case cast (strftime('%w', date('now')) as integer)
    when 0 then 'Domingo'
    when 1 then 'Lunes'
    when 2 then 'Martes'
    when 3 then 'Miercoles'
    when 4 then 'Jueves'
    when 5 then 'Viernes'
    when 6 then 'Sabado' end`;
    db.transaction((tx) => {
      tx.executeSql(query, [], (trans, result) => {
        resolve(result.rows._array);
      });
    });
  });
};
export const insertTaskDone = (db, taskId) => {
  const insertQuery = `INSERT INTO tasks_done ( date_time, task_id) values ( datetime('now','localtime' ), ?)`;
  return new Promise(
    async (resolve) =>
      await db.transaction(async (tx) => {
        await tx.executeSql(
          insertQuery,
          [taskId],
          () => {
            console.log(`inserted data success`);
            // Resovle when the data is successful
            tx.executeSql(
              "select * from tasks_done",
              [],
              (_, { rows }) => {
                resolve(rows._array.pop().date_time);
              },
              (_, err) => {
                console.log(`err: ${err}`);
              }
            );
          },
          (_, err) => {
            console.log(`err: ${err}`);
          }
        );
      })
  );
};
export const getTasksWeek = (db) => {
  const selectQuery = `SELECT * FROM tasks`;
  return new Promise(
    async (resolve) =>
      await db.transaction(async (tx) => {
        await tx.executeSql(
          selectQuery,
          [],
          (_, { rows }) => {
            const days = rows._array.map((row) => row.day);
            const daysNoRepeat = new Set(days);
            const orderedDays = [];
            orden.forEach((day) => {
              [...daysNoRepeat].map((item) => {
                if (day === item) {
                  orderedDays.push(item);
                }
              });
            });
            const data = orderedDays.map((row) => {
              return {
                title: row,
                data: rows._array.filter((x) => x.day === row),
              };
            });
            resolve(data);
          },
          (_, err) => {
            console.log(`err: ${err}`);
          }
        );
      })
  );
};
export const getTasksOfDay = (db) => {
  const selectQuery = `SELECT t.*,
  (SELECT Count(*)
   FROM   tasks_done
   WHERE  task_id = t.id
          AND Strftime('%Y-%W', date_time) =
              Strftime('%Y-%W', 'now', 'localtime')
  ) AS completed,
  (SELECT date_time
   FROM   tasks_done
   WHERE  task_id = t.id
          AND Strftime('%Y-%W', date_time) =
              Strftime('%Y-%W', 'now', 'localtime')
  ) AS check_date
FROM   tasks AS t
WHERE  t.day = CASE Cast (Strftime('%w', Date('now', 'localtime')) AS INTEGER)
            WHEN 0 THEN 'Domingo'
            WHEN 1 THEN 'Lunes'
            WHEN 2 THEN 'Martes'
            WHEN 3 THEN 'Miercoles'
            WHEN 4 THEN 'Jueves'
            WHEN 5 THEN 'Viernes'
            WHEN 6 THEN 'Sabado'
          END `;
  return new Promise(
    async (resolve) =>
      await db.transaction(async (tx) => {
        await tx.executeSql(
          selectQuery,
          [],
          (_, { rows }) => {
            const data = rows._array.map((task) =>
              parseInt(task.completed) > 0
                ? { ...task, completed: true }
                : { ...task, completed: false }
            );
            resolve(data);
          },
          (_, err) => {
            console.log(`err: ${err}`);
          }
        );
      })
  );
};
