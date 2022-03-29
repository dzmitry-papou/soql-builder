({
    setFilterValuesHlp : function(component) {
        const filterValues = [
            {label : "=", value : "="},
            {label : "≠", value : "!="},
            {label : "<", value : "<"},
            {label : "<=", value : "<="},
            {label : ">", value : ">"},
            {label : ">=", value : ">="},
            {label : "starts with", value : "LIKE%"},
            {label : "ends with", value : "%LIKE"},
            {label : "contains", value : "%LIKE%"},
            {label : "in", value : "IN"},
            {label : "not in", value : "NOT IN"},
            {label : "includes", value : "INCLUDES"},
            {label : "excludes", value : "EXCLUDES"}
        ];
        component.set('v.filterValues', filterValues);
    },

    clearValuesHlp : function(component) {
        component.set('v.fieldForSorting', '');
        component.set('v.ascOrDescForSorting', 'ASC');
        component.set('v.nullsForSorting', 'NULLS FIRST');
        component.set('v.fieldForFilter', '');
        component.set('v.filterAction', '=');
        component.set('v.filterValue', '');
        component.set('v.limit', '');
    },

    getFilteringQueryHlp : function(filterField, filterAction, filterValue) {
        let query = '';
        if (filterField != '' && filterValue != '' && !filterAction.includes('%')) {
            query = ' WHERE ' + filterField + ' ' + filterAction + ' \'' + filterValue + '\'';
        } else if (filterField != '' && filterValue != '') {
            if (filterAction.startsWith('%')) {
                filterValue = filterAction.slice(0, 1) + filterValue;
                filterAction = filterAction.slice(1);
            }
            if (filterAction.endsWith('%')) {
                filterValue = filterValue + filterAction.slice(-1);
                filterAction = filterAction.slice(0, -1);
            }
            query = ' WHERE ' + filterField + ' ' + filterAction + ' \'' + filterValue + '\'';
        }
        return query;
    },

    fireEventHlp : function(component, eventName, query) {
        let cmpEvent = component.getEvent(eventName);
        cmpEvent.setParams({
            "query" : query
        });
        cmpEvent.fire();
    }
})