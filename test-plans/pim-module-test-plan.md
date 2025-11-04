# PIM Module Test Plan - OrangeHRM

## Overview
This test plan covers the Personnel Information Management (PIM) module of OrangeHRM, focusing on employee information management functionality.

## Test Environment
- **Application URL**: https://opensource-demo.orangehrmlive.com
- **Browser**: Chromium
- **Test Framework**: Playwright
- **Test Data**: JSON files containing employee information

## Features to be Tested

### 1. Employee List Navigation & Search
#### 1.1 Navigation
- Access PIM module from dashboard
- Verify employee list page loads correctly
- Verify column headers and sorting functionality
- Pagination functionality

#### 1.2 Search Functionality
**Test Scenarios:**
1. Search by Employee Name
   - Full name search
   - Partial name search
   - Case-insensitive search
   
2. Search by Employee ID
   - Exact ID match
   - Partial ID search
   
3. Search by Employment Status
   - Filter by different employment statuses
   - Multiple status selection

4. Search by Include
   - Current Employees Only
   - Current and Past Employees
   - Past Employees Only

5. Search by Supervisor Name
   - Valid supervisor name
   - Invalid supervisor name

6. Combined Search Criteria
   - Multiple valid parameters
   - Mix of valid and invalid parameters

### 2. Add Employee
#### 2.1 Basic Information
**Test Scenarios:**
1. Add Employee with Minimum Required Fields
   - First Name
   - Last Name
   - Employee ID (auto-generated)

2. Add Employee with All Fields
   - First Name
   - Middle Name
   - Last Name
   - Employee ID
   - Profile Picture
   - Create Login Details

3. Add Employee with Login Credentials
   - Username validation
   - Password requirements
   - Status selection
   - Role assignment

#### 2.2 Validation Checks
**Test Scenarios:**
1. Field Validations
   - Empty required fields
   - Invalid characters in names
   - Duplicate Employee ID
   - Invalid file format for photograph
   - Maximum length checks

2. Login Details Validation
   - Username uniqueness
   - Password complexity rules
   - Confirm password match

### 3. Edit Employee
#### 3.1 Personal Details
**Test Scenarios:**
1. Basic Information Update
   - Name fields
   - DOB
   - Gender
   - Nationality
   - Marital Status
   - Blood Type

2. Custom Fields
   - Add custom field data
   - Edit existing custom fields
   - Remove custom field data

#### 3.2 Contact Details
**Test Scenarios:**
1. Address Information
   - Street 1 & 2
   - City
   - State/Province
   - Zip Code
   - Country

2. Contact Information
   - Work Phone
   - Mobile Phone
   - Work Email
   - Other Email

### 4. Delete Employee
**Test Scenarios:**
1. Single Employee Deletion
   - Delete with confirmation
   - Cancel deletion

2. Multiple Employee Deletion
   - Select multiple employees
   - Bulk delete operation
   - Verification of deleted records

### 5. Employee Reports
**Test Scenarios:**
1. Report Generation
   - Personal Info Report
   - Custom field report
   - Employee status report

2. Report Export
   - PDF format
   - CSV format
   - Excel format

## Test Data Requirements

### Employee Data Sets
1. **Valid Data Set**
   ```json
   {
     "firstName": "John",
     "middleName": "William",
     "lastName": "Doe",
     "employeeId": "EMP001",
     "nationality": "American",
     "maritalStatus": "Single",
     "dateOfBirth": "1990-01-01"
   }
   ```

2. **Boundary Test Data**
   - Maximum length names
   - Special characters in names
   - Various date formats
   - Different file formats for photos

### Test Dependencies
1. Admin access rights
2. Valid employee records in system
3. Different employee statuses
4. Various employment types
5. Multiple supervisors

## Success Criteria
1. All test cases execute without critical failures
2. Employee data is correctly saved and retrieved
3. Search functionality returns accurate results
4. Reports generate with correct data
5. No data corruption during CRUD operations

## Risk Analysis
1. **High Risk Areas**
   - Employee data integrity
   - Personal information security
   - File upload functionality
   - Bulk operations

2. **Mitigation Strategies**
   - Thorough validation testing
   - Backup test data
   - Isolated test environment
   - Incremental testing approach

## Automation Scope
1. **Priority for Automation**
   - Employee CRUD operations
   - Search functionality
   - Basic validation checks
   - Report generation

2. **Manual Testing Focus**
   - Complex UI interactions
   - Visual verifications
   - Exploratory testing
   - Edge cases

## Defect Management
- Defect severity levels defined
- Reproduction steps required
- Screenshots/videos for UI issues
- Test data state for failures

## Exit Criteria
1. All planned test cases executed
2. No critical or high-severity defects open
3. All major functionality verified
4. Performance criteria met
5. Test results documented