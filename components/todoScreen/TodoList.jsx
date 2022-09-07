import { ScrollView } from "react-native";
import TodoItem from "./TodoItem";

export default function TodoList(todosData) {
  const { todos, toggleTodo, } = todosData;
  return (
    <ScrollView style={{ height: "100%" }}>
      {todos.map((todo, index) => {
        return <TodoItem key={index} item={todo} toggleTodo={toggleTodo} />;
      })}
    </ScrollView>
  );
}
