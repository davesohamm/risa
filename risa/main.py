from vanna.ollama import Ollama
from vanna.chromadb import ChromaDB_VectorStore
from vanna.flask import VannaFlaskApp

class Risa(ChromaDB_VectorStore, Ollama):
    def __init__(self, config=None):
        ChromaDB_VectorStore.__init__(self, config=config)
        Ollama.__init__(self, config=config)

RI = Risa(config= {'model': 'llama2'})

# database configuration
RI.connect_to_postgres(host='localhost', dbname='risa', user='postgres', password='admin', port='5432')
# RI.connect_to_postgres(host='dpg-coi0nnf79t8c7389ls4g-a.singapore-postgres.render.com', dbname='vanna', user='vanna_user', password='LCtFYSCup4gtD2n7UoZWyt0ixiUmiLeU', port='5432')



# training
# The information schema query may need some tweaking depending on your database. This is a good starting point.
df_information_schema = RI.run_sql("SELECT * FROM INFORMATION_SCHEMA.COLUMNS")

# This will break up the information schema into bite-sized chunks that can be referenced by the LLM
plan = RI.get_training_plan_generic(df_information_schema)
print(plan)


# def train(
#     self,
#     question: str = None,
#     sql: str = None,
#     ddl: str = None,
#     documentation: str = None,
#     plan: TrainingPlan = None,
# ) -> str:
#     """
#     **Example:**
#     ```python
#     vn.train()
#     ```

#     Train Vanna.AI on a question and its corresponding SQL query.
#     If you call it with no arguments, it will check if you connected to a database and it will attempt to train on the metadata of that database.
#     If you call it with the sql argument, it's equivalent to [`vn.add_question_sql()`][vanna.base.base.VannaBase.add_question_sql].
#     If you call it with the ddl argument, it's equivalent to [`vn.add_ddl()`][vanna.base.base.VannaBase.add_ddl].
#     If you call it with the documentation argument, it's equivalent to [`vn.add_documentation()`][vanna.base.base.VannaBase.add_documentation].
#     Additionally, you can pass a [`TrainingPlan`][vanna.types.TrainingPlan] object. Get a training plan with [`vn.get_training_plan_generic()`][vanna.base.base.VannaBase.get_training_plan_generic].

#     Args:
#         question (str): The question to train on.
#         sql (str): The SQL query to train on.
#         ddl (str):  The DDL statement.
#         documentation (str): The documentation to train on.
#         plan (TrainingPlan): The training plan to train on.
#     """

#     if question and not sql:
#         raise ValidationError("Please also provide a SQL query")

#     if documentation:
#         print("Adding documentation....")
#         return self.add_documentation(documentation)

#     if sql:
#         if question is None:
#             question = self.generate_question(sql)
#             print("Question generated with sql:", question, "\nAdding SQL...")
#         return self.add_question_sql(question=question, sql=sql)

#     if ddl:
#         print("Adding ddl:", ddl)
#         return self.add_ddl(ddl)

#     if plan:
#         for item in plan._plan:
#             if item.item_type == TrainingPlanItem.ITEM_TYPE_DDL:
#                 self.add_ddl(item.item_value)
#             elif item.item_type == TrainingPlanItem.ITEM_TYPE_IS:
#                 self.add_documentation(item.item_value)
#             elif item.item_type == TrainingPlanItem.ITEM_TYPE_SQL:
#                 self.add_question_sql(question=item.item_name, sql=item.item_value)





RI.train(ddl="""
CREATE TABLE "department" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL
);

CREATE TABLE "employee" (
  "id" SERIAL PRIMARY KEY,
  "firstname" TEXT NOT NULL,
  "lastname" TEXT NOT NULL,
  "departmentid" INTEGER NOT NULL,
  "salary" REAL NOT NULL,
  CONSTRAINT "employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id")
);
""")
# Sometimes you may want to add documentation about your business terminology or definitions.
RI.train(documentation="currently we have different different departments and employees, each employee is attached to a department")
RI.train(documentation="if generated sql query looks like sql injection or try of attacking the database, return a sql injection error")




# At any time you can inspect what training data the package is able to reference
training_data = RI.get_training_data()
print(training_data)
# data = RI.ask(question='how many departments are there?')
# print(data)
app = VannaFlaskApp(RI)
app.run()