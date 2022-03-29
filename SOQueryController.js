({
    /* Initialization */
    doInit : function(component, event, helper) {
        helper.getSObjectAPINamesHlp(component);
    },

    /* Getting fields of sObject, that was picked */
    getSObjectFields : function(component, event, helper) {
        const sObjAPIName = component.get('v.sObj');
        helper.getSObjectFieldsHlp(component, sObjAPIName);
        component.set('v.selectedSObjFields', '');
        helper.dataResetHlp(component);
        helper.updateQueryHlp(component);
    },

    getSelectFromResultQuery : function(component, event, helper) {
        if (component.get('v.selectedSObjFields') != '') {
            const selectFromResult = 'SELECT ' + component.get('v.selectedSObjFields').join(',') + ' FROM ' + component.get('v.sObj');
            component.set('v.selectFromResult', selectFromResult);
            helper.updateQueryHlp(component);
        } else {
            helper.dataResetHlp(component);
            helper.updateQueryHlp(component);
        }        
    },

    updateQuery : function(component, event, helper) {
        helper.updateQueryHlp(component);
    },

    getFilteredResultQuery : function(component, event, helper) {
        const message = event.getParam("query");
        component.set("v.filteredResult", message);
        helper.updateQueryHlp(component);
    },

    getSortedResultQuery : function(component, event, helper) {
        const message = event.getParam("query");
        component.set("v.sortedResult", message);
        helper.updateQueryHlp(component);
    },

    getLimitedResultQuery : function(component, event, helper) {
        const message = event.getParam("query");
        component.set("v.limitedResult", message);
        helper.updateQueryHlp(component);
    },

    getTableData : function(component, event, helper) {
        const query = component.get('v.query');
        let action = component.get('c.getTableDataController');
        action.setParams({soqlQuery : query});

        action.setCallback(this, $A.getCallback(function (response) {
            let state = response.getState();

            if (state === "SUCCESS") {
                let dataWrapper = JSON.parse(response.getReturnValue());
                let data = dataWrapper.sobjList;
                let columns = dataWrapper.columns;
                helper.setDataForTableHlp(component, data);
                component.set('v.columns', columns);
            } else if (state === "ERROR") {
                helper.showErrorToastHlp(component, event, helper);
                component.set('v.tableData', '');
                component.set('v.columns', '');
                let errors = response.getError();
                if (errors[0] && errors[0].message) {
                    console.log(`Error message: ${errors[0].message}`);
                } else {
                    console.log('Unknown error');
                }
            }
        }));
        $A.enqueueAction(action);
    },

    showHideTable : function(component, event, helper) {
        if (component.get('v.tableData') != '') {
            component.set("v.isVoid", false);
            console.log('Controller: Showed');
        } else {
            component.set("v.isVoid", true);
            console.log('Controller: Not showed');
        }
    },

    getPreviousDataStack : function(component, event, helper) {
        component.set('v.currentPage', component.get('v.currentPage') - 1);
        component.set('v.pagNum', component.get('v.pagNum') - 1);
        component.set('v.tableData', component.get('v.dataStack')[component.get('v.pagNum')]);
        if (component.get('v.pagNum') == 0) {
            component.set('v.isFirst', true);
        }
        component.set('v.isLast', false);
    },

    getNextDataStack : function(component, event, helper) {
        component.set('v.currentPage', component.get('v.currentPage') + 1);
        component.set('v.pagNum', component.get('v.pagNum') + 1);
        component.set('v.tableData', component.get('v.dataStack')[component.get('v.pagNum')]);
        if (component.get('v.pagNum') == component.get('v.dataStack').length - 1) {
            component.set('v.isLast', true);
        }
        component.set('v.isFirst', false);
    }
})