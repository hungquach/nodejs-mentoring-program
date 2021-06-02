export default interface groupDomainEntity {
    id: string,
    name: string,
    permissions: string[],
    users: string[],
    userIds: string[]
}