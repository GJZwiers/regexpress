// import { expect }  from 'chai';
// import { TemplateMapper } from '../src/index';

// describe('TemplateMapper', () => {
//     it('Should map a list of regex matches to an object with group names as object keys', () => {
//         const matchArr: RegExpMatchArray = ['completeText', 'groupOneText'];
//         expect(TemplateMapper.map(matchArr, '(groupOne)')).to.deep.equal({ fullMatch: 'completeText', groupOne: 'groupOneText' });
//     });

//     it('Should map a template without capture groups as an object with a single fullMatch key', () => {
//         const matchArr: RegExpMatchArray = ['completeText'];
//         expect(TemplateMapper.map(matchArr, 'groupOne')).to.deep.equal({ fullMatch: 'completeText' });
//     });

//     it('Should map a template with nested groups', () => {
//         const matchArr: RegExpMatchArray = ['completeText', 'one', 'two', 'three'];
//         expect(TemplateMapper.map(matchArr, '(one(two))(three)')).to.deep.equal({ fullMatch: 'completeText', one: 'groupOneText', two: 'groupTwoText', three:  'three' });
//     });

//     it('Should throw an error when results are null', () => {
//         const matchArr = null;
//         expect(() => { 
//             TemplateMapper.map(matchArr, '(groupOne)')
//         } ).to.throw();
//     });

//     it('Should throw an error when encountering a duplicate group name', () => {
//         const matchArr: RegExpMatchArray = ['completeText', 'g1', 'g2'];
//         expect(() => { 
//             TemplateMapper.map(matchArr, '(group)(group)')
//         } ).to.throw();
//     });

// });
