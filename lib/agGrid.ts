import {ModuleRegistry} from 'ag-grid-community'
import {
    AllEnterpriseModule,
    LicenseManager,
} from 'ag-grid-enterprise'
import md5 from 'md5'

function generateKey(time: Date): string {
    const unixTimestampMs = new Date(time).getTime()
    const base64Timestamp = btoa(unixTimestampMs.toString())
    const formattedString = `[v3][Release][0102]_${base64Timestamp}`
    return `${formattedString}${md5(formattedString)}`
}

function getLicenseKey(): string {

    const timeInput = new Date()
    timeInput.setMonth(timeInput.getMonth() + 1)
    return generateKey(timeInput)

}

export const initializeAgGrid = () => {
    ModuleRegistry.registerModules([
        AllEnterpriseModule,
    ])
    const license = getLicenseKey()
    LicenseManager.setLicenseKey(license)
}