({
    doInit : function(component, event, helper) {
        helper.setFilterValuesHlp(component);
    },

    changeIsDisabled : function(component, event, helper) {
        if (component.get('v.selectedSObjFields') != '') {
            component.set('v.isDisabled', false);
        } else {
            component.set('v.isDisabled', true);
            helper.clearValuesHlp(component);
        }
    },

    clearValues : function(component, event, helper) {
        helper.clearValuesHlp(component);
    },

    fireSortingEvent : function(component, event, helper) {
        let query = '';
        if (component.get('v.fieldForSorting') != '') {
            query = ' ORDER BY ' + component.get('v.fieldForSorting') + ' ' + 
                component.get('v.ascOrDescForSorting') + ' ' + component.get('v.nullsForSorting');
        }
        helper.fireEventHlp(component, "sortingEvent", query);
    },

    fireFilteringEvent : function(component, event, helper) {
        let query = helper.getFilteringQueryHlp(component.get('v.fieldForFilter'), 
            component.get('v.filterAction'), component.get('v.filterValue'));
        helper.fireEventHlp(component, "filteringEvent", query);
    },

    fireLimitEvent : function(component, event, helper) {
        let query = '';
        if (component.get('v.limit') != '') {
            query = ' LIMIT ' + component.get('v.limit');
        }
        helper.fireEventHlp(component, "limitEvent", query);
    },
})