public class SOQLBuilderController {

    @AuraEnabled
    public static String getSObjectAPINamesController() {
        List<EntityDefinition> sObjectAPINames = [SELECT QualifiedApiName FROM EntityDefinition ORDER BY QualifiedApiName];
        List<String> stringSObjectAPINames = new List<String>();
        for (EntityDefinition item : sObjectAPINames) {
            stringSObjectAPINames.add(item.QualifiedApiName);
        }
        return JSON.serialize(stringSObjectAPINames);
    }

    @AuraEnabled
    public static String getSObjectFieldsController(String sObjectAPIName) {
        List<String> sObjectFields = new List<String>();
        Map <String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Map <String, Schema.SObjectField> fieldMap = schemaMap.get(sObjectAPIName).getDescribe().fields.getMap();
        for(String sField : fieldMap.keySet()) {
            Schema.SObjectField item = fieldMap.get(sField);
            Schema.DescribeFieldResult dField = item.getDescribe();
            sObjectFields.add(dField.getName());
        }
        return JSON.serialize(sObjectFields);
    }

    class Column {
        String label;
        String fieldName;
        String type;

        Column (String label, String fieldName, String type) {
            this.label = label;
            this.fieldName = fieldName;
            this.type = type;
        }
    }

    class Wrapper {
        List<sObject> sobjList;
        List<Column> columns;

        Wrapper (List<SObject> sobjList, List<Column> columns) {
            this.sobjList = sobjList;
            this.columns = columns;
        }
    }

    @AuraEnabled
    public static String getTableDataController(String soqlQuery) {
        List<sObject> sobjList = Database.query(soqlQuery);
        List<Column> columns = new List<Column>();
        columns.add(new Column('Record Number', 'recNum', 'number'));
        List<String> stringsFromQuery = soqlQuery.split(' ');
        List<String> fieldsArray = stringsFromQuery[1].split(',');
        String sObj = stringsFromQuery[3];
        
        Map <String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Map <String, Schema.SObjectField> fieldMap = schemaMap.get(sObj).getDescribe().fields.getMap();
        for(String sField : fieldMap.keySet()) {
            Schema.SObjectField item = fieldMap.get(sField);
            Schema.DescribeFieldResult dField = item.getDescribe();
            String name = dField.getName();
            if (!fieldsArray.contains(name)) {
                continue;
            }
            String label = dField.getLabel();
            Schema.DisplayType dType = dField.getType();
            String type = SOQLBuilderController.getTypeOfField(dType);
            columns.add(new Column(label, name, type));
        }
        Wrapper dataWrapper = new Wrapper(sobjList, columns);
        return JSON.serialize(dataWrapper);
    }

    private static String getTypeOfField(Schema.DisplayType dType) {
        if (dType == Schema.DisplayType.DATE) {
            return 'date';
        } else if (dType == Schema.DisplayType.BOOLEAN) {
            return 'boolean';
        } else if (dType == Schema.DisplayType.CURRENCY) {
            return 'currency';
        } else if (dType == Schema.DisplayType.LOCATION) {
            return 'location';
        } else if (dType == Schema.DisplayType.PERCENT) {
            return 'percent';
        } else if (dType == Schema.DisplayType.URL) {
            return 'url';
        } else if (dType == Schema.DisplayType.EMAIL) {
            return 'email';
        } else if (dType == Schema.DisplayType.PHONE) {
            return 'phone';
        } else if (dType == Schema.DisplayType.INTEGER) {
            return 'number';
        } else {
            return 'text';
        }
    }
}